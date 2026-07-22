import { BadRequestException, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthenticationMiddleware } from 'src/common/middleware/authentication.middleware';
import { AuthenticationGuard, AuthorizationGuard, CacheService, SecurityModule, TokenService, UserRepository } from 'src/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModel } from 'src/model';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [JwtModule, UserModel, SecurityModule,
    MulterModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService, AuthenticationGuard, AuthorizationGuard, UserRepository],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthenticationMiddleware).forRoutes({ path: "user/*path", method: RequestMethod.ALL })
  }
}
