import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { createNumberOtp, EmailEnum, emailEvent, EmailService, IUser, ProviderEnum, TokenService, UserRepository } from 'src/common';
import { CacheService } from 'src/common/modules/security/cache.service';
import { SecurityService } from 'src/common/modules/security/security.service';
import { ResendConfrimEmailDto } from './dto/resendEmail.dto';
import { ConfrimEmailDto } from './dto/confirmEmail.dto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly redisClient: CacheService,
        private readonly emailService: EmailService,
        private readonly securityService: SecurityService,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService
    ) {
    }

    private async verifyGoogleAccount(idToken: string) {
        const client = new OAuth2Client()
        const ticket = await client.verifyIdToken({
            idToken,
            audience: this.configService.get<string>("WEB_CLIENT_ID")
        })
        const payload = ticket.getPayload()
        if (!payload?.email_verified) {
            throw new BadRequestException("Invalid token payload")
        }
        return payload
    }

    private async resendOTP({ email, subject, title }: { email: string, subject: EmailEnum, title: string }) {
        const isBlocked = await this.redisClient.ttl({ key: this.redisClient.otpBlockTemplateKey({ email, subject }) }) as number;

        if (isBlocked > 0) {
            throw new BadRequestException("Sorry we can't request another otp rn please try again after 10 minutes",);
        }

        const hashOtp = await this.redisClient.ttl({ key: this.redisClient.otpTemplateKey({ email, subject }) }) as number;

        if (hashOtp > 0) {
            throw new BadRequestException("Sorry we can't request another otp rn please try again later",);
        }

        const maxTrial = await this.redisClient.get({ key: this.redisClient.otpMaxTrial({ email, subject }) });
        const maxTrialNumber = Number(maxTrial)

        if (maxTrialNumber >= 3) {
            await this.redisClient.set({
                key: this.redisClient.otpBlockTemplateKey({ email, subject }),
                value: 1,
                ttl: 600,
            });
            throw new BadRequestException("Can't generate more OTP's right not please try again later",);
        }

        const code = await createNumberOtp();
        await this.redisClient.set({
            key: this.redisClient.otpTemplateKey({ email, subject }),
            value: await this.securityService.generateHash({ plaintext: `${code}` }),
            ttl: 300,
        });

        emailEvent.emit("sendEmail", async () => {
            await this.emailService.sendEmail({
                to: email,
                subject,
                html: this.emailService.emailTemplate({ title, code }),
            });

            await this.redisClient.incr({ key: this.redisClient.otpMaxTrial({ email, subject }) });
        });
    };

    public async Signup(data: SignupDTO): Promise<IUser> {
        const { email, password, username, phone, gender } = data
        const checkUser = await this.userRepository.findOne({
            filter: { email },
            projection: { _id: 1, email: 1, username: 1, firstName: 1, lastName: 1 },
            options: { runValidators: true, lean: true },
            populate: [{ path: 'email', select: 'username' }]
        })

        if (checkUser) {
            throw new ConflictException("User Already Signedup")
        }

        const result = await this.userRepository.createOne({
            data: {
                email,
                username,
                password: await this.securityService.generateHash({ plaintext: password }),
                ...(phone ? { phone: this.securityService.generateEncryption(phone) } : {}),
                gender
            }
        })

        if (!result) {
            throw new BadRequestException("Something went wrong")
        }

        await this.emailService.sendEmail({ to: email, subject: "Confirm Email", html: this.emailService.emailTemplate({ code: 342324, title: "Clouven" }) })

        return result.toJSON()
    }

    public async ConfirmSignup({ email, otp }: ConfrimEmailDto) {

        const checkUser = await this.userRepository.findOne({
            filter: {
                email,
                confirmEmail: { $exists: false },
                provider: ProviderEnum.System,
            },
        });
        if (!checkUser) {
            throw new NotFoundException("User is not found to be verfied");
        }

        const hashOtp = await this.redisClient.get({
            key: this.redisClient.otpTemplateKey({ email, subject: EmailEnum.ConfirmEmail }),
        });

        if (!hashOtp) {
            throw new NotFoundException("Didn't find your one time password");
        }

        if (!(await this.securityService.compareHash({ plaintext: otp, ciphertext: hashOtp }))) {
            throw new ConflictException("Invalid OTP");
        }

        checkUser.confirmEmail = new Date();
        await checkUser.save();

        const keysToDelete = await this.redisClient.keys({
            prefix: this.redisClient.otpTemplateKey({ email, subject: EmailEnum.ConfirmEmail }),
        }) ?? [];

        if (keysToDelete.length) {
            await this.redisClient.deletekey({ key: keysToDelete });
        }

        return;
    };

    public async ResendConfirmSignup({ email }: ResendConfrimEmailDto) {

        const checkUser = await this.userRepository.findOne({
            filter: {
                email,
                confirmEmail: { $exists: false },
                provider: ProviderEnum.System,
            },
        });
        if (!checkUser) {
            throw new NotFoundException("User is not found to be verfied");
        }

        await this.resendOTP({
            email,
            subject: EmailEnum.ConfirmEmail,
            title: "Verify Email",
        });

        return;
    };

    public async Login({ email, password }: LoginDTO): Promise<any> {

        const checkUser = await this.userRepository.findOne({
            filter: { email, provider: ProviderEnum.System, confirmEmail: { $exists: true } },
            // select:'firstName lastName email',
            options: {
                lean: true,
            },
        });
        if (!checkUser) {
            throw new NotFoundException("Couldn't Find This User");
        }
        if (!checkUser.confirmEmail) {
            throw new ConflictException(
                "Verify your account before you can signin",
            );
        }
        if (checkUser.phone) {
            checkUser.phone = await this.securityService.generateDecryption(checkUser.phone);
        }
        const match = await this.securityService.compareHash({
            plaintext: password,
            ciphertext: checkUser.password,
            // approach: HashApproachEnums.argon2
        });

        if (!match) {
            throw new NotFoundException("Email or password is wrong");
        }

        return await this.tokenService.createLoginCredentials(checkUser);
    };

    public async LoginWithGmail(idToken: string) {
        const payload = await this.verifyGoogleAccount(idToken)

        const user = await this.userRepository.findOne({
            filter: {
                email: payload.email as string,
                provider: ProviderEnum.Google
            }
        })

        if (!user) {
            throw new NotFoundException("Invalid Account provider or not registered account")
        }

        return await this.tokenService.createLoginCredentials(user)
    }

    public async SignupWithGmail(idToken: string) {
        const payload = await this.verifyGoogleAccount(idToken)

        const checkUser = await this.userRepository.findOne({
            filter: {
                email: payload.email as string
            }
        })

        if (checkUser) {
            if (checkUser?.provider !== ProviderEnum.Google) {
                throw new ConflictException('Invalid Account Provider')
            }
            return { status: 200, credentials: await this.tokenService.createLoginCredentials(checkUser) }
        }

        const account = await this.userRepository.createOne({
            data: {
                firstName: payload.given_name,
                lastName: payload.family_name ?? '',
                email: payload.email,
                profilePicture: payload.picture,
                confirmEmail: new Date(),
                provider: ProviderEnum.Google
            }
        })

        return { status: 201, credentials: await this.tokenService.createLoginCredentials(account) }

    }
}
