// import { ConfigService } from '@nestjs/config';
// import { AuthenticationService } from './authentication.service';
// import { EmailService } from 'src/common/utils/service/email.service';
// import { SecurityService } from 'src/common/modules/security/security.service';
// import { TokenService } from 'src/common/modules/security/token.service';
// import { CacheService } from 'src/common/modules/security/cache.service';
// import { UserRepository } from 'src/common/repository/user.repository';
// import { GenderEnum } from 'src/common';

// describe('AuthenticationService', () => {
//   it('maps the signup username into first and last name when creating a user', async () => {
//     const createOne = jest.fn().mockResolvedValue({ toJSON: () => ({}) });
//     const findOne = jest.fn().mockResolvedValue(null);
//     const userRepository = {
//       findOne,
//       createOne,
//     } as unknown as UserRepository;

//     const redisClient = {
//       ttl: jest.fn(),
//       get: jest.fn(),
//       set: jest.fn(),
//       incr: jest.fn(),
//       keys: jest.fn(),
//       deletekey: jest.fn(),
//       otpBlockTemplateKey: jest.fn(),
//       otpTemplateKey: jest.fn(),
//       otpMaxTrial: jest.fn(),
//     } as unknown as CacheService;

//     const emailService = {
//       sendEmail: jest.fn().mockResolvedValue(undefined),
//       emailTemplate: jest.fn().mockReturnValue('<div>email</div>'),
//     } as unknown as EmailService;

//     const securityService = {
//       generateHash: jest.fn().mockResolvedValue('hashed-password'),
//       compareHash: jest.fn().mockResolvedValue(true),
//       generateEncryption: jest.fn().mockReturnValue('encrypted-phone'),
//       generateDecryption: jest.fn().mockResolvedValue('phone'),
//     } as unknown as SecurityService;

//     const tokenService = {} as TokenService;
//     const configService = { get: jest.fn() } as unknown as ConfigService;

//     const service = new AuthenticationService(
//       userRepository,
//       redisClient,
//       emailService,
//       securityService,
//       tokenService,
//       configService,
//     );

//     await service.Signup({
//       email: 'jane@example.com',
//       password: 'Aa1!aaaa',
//       username: 'Jane Doe',
//       gender: GenderEnum.Female,
//       confirmPassword: 'Aa1!aaaa',
//     } as any);

//     expect(createOne).toHaveBeenCalledWith(
//       expect.objectContaining({
//         data: expect.objectContaining({
//           firstName: 'Jane',
//           lastName: 'Doe',
//         }),
//       }),
//     );
//   });
// });
