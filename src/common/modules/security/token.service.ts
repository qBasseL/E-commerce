import { JwtPayload, SignOptions } from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { CacheService } from './cache.service'
import { UserRepository } from 'src/common/repository'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { RoleEnum, TokenTypeEnums } from 'src/common/enum'
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'

type SignatureType = { accessSignature: string, refreshSignature: string }

@Injectable()
export class TokenService {

    constructor(
        private readonly redis: CacheService,
        private readonly UserModel: UserRepository,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {

    }


    public async Sign({ payload, secret = this.configService.get<string>("TOKEN_ACCESS_SECRET_KEY")!, options }: {
        payload: object,
        secret: string,
        options?: SignOptions
    }): Promise<string> {
        return this.jwtService.signAsync(payload, { secret, ...options })
    }

    public async Verify({ token, secret = this.configService.get<string>("TOKEN_ACCESS_SECRET_KEY")! }: {
        token: string,
        secret: string,
    }): Promise<JwtPayload | string> {
        return await this.jwtService.verifyAsync(token, { secret })
    }

    public async detectSignatureLevels(level: RoleEnum): Promise<SignatureType> {
        let signature: SignatureType;

        switch (level) {
            case RoleEnum.Admin:
                signature = {
                    accessSignature: this.configService.get<string>("SYSTEM_TOKEN_ACCESS_SECRET_KEY")!,
                    refreshSignature: this.configService.get<string>("SYSTEM_TOKEN_REFRESH_SECRET_KEY")!,
                };
                break;

            default:
                signature = {
                    accessSignature: this.configService.get<string>("TOKEN_ACCESS_SECRET_KEY")!,
                    refreshSignature: this.configService.get<string>("TOKEN_REFRESH_SECRET_KEY")!,
                };
                break;
        }

        return signature;
    };

    public async decodeToken({
        token,
        tokenType = TokenTypeEnums.Access_Token,
    }: { token: string, tokenType: TokenTypeEnums }) {
        const decoded = this.jwtService.decode(token) as JwtPayload;

        if (!decoded || typeof decoded === "string") {
            throw new NotFoundException("Invalid Token Payload");
        }
        const { accessSignature, refreshSignature } = await this.detectSignatureLevels(
            decoded.role,
        );

        const secretKey = tokenType === TokenTypeEnums.Access_Token ? accessSignature : refreshSignature;
        let verifiedData: JwtPayload;

        try {
            verifiedData = await this.Verify({
                token: token,
                secret: secretKey,
            }) as JwtPayload;
        } catch (error) {
            throw new NotFoundException("Wrong Token");
        }

        if (verifiedData.type !== tokenType) {
            throw new NotFoundException("Invalid Token Type");
        }

        if (
            decoded.jti &&
            (await this.redis.get({
                key: this.redis.revokeTokenKey({ userId: decoded.sub as string, jti: decoded.jti as string }),
            }))
        ) {
            throw new UnauthorizedException("Invalid Login Session");
        }

        const user = await this.UserModel.findOne({
            filter: {
                _id: verifiedData.sub,
            },
        });

        if (!user) {
            throw new NotFoundException("Couldn't find that user");
        }

        if (!decoded.iat) {
            throw new BadRequestException("Something Went Wrong")
        }

        if (
            user.changeCredentialTime &&
            user.changeCredentialTime?.getTime() >= decoded.iat * 1000
        ) {
            throw new UnauthorizedException("Invalid Login Session");
        }

        return { user, decoded };
    };

    public async createLoginCredentials(user: any) {

        const jwtid = randomUUID();

        const access_token = await this.Sign({
            payload: { sub: user._id, role: user.role, type: "access" },
            secret: this.configService.get<string>("TOKEN_ACCESS_SECRET_KEY")!,
            options: {
                expiresIn: Number(this.configService.get<number>("ACCESS_TOKEN_EXPIRES_IN")!),
                issuer: "bassel-api",
                audience: [user.role],
                jwtid,
            },
        });

        const refresh_token = await this.Sign({
            payload: { sub: user._id, role: user.role, type: "refresh" },
            secret: this.configService.get<string>("TOKEN_REFRESH_SECRET_KEY")!,
            options: {
                expiresIn: Number(this.configService.get<string>("REFRESH_TOKEN_EXPIRES_IN")!),
                issuer: "bassel-api",
                audience: [user.role],
                jwtid,
            },
        });

        return { Access_Token: access_token, Refresh_Token: refresh_token };
    }

}