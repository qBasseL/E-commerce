import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModel } from 'src/model';
import { defaultLanguage, EmailService, SecurityModule, UserRepository } from 'src/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModel, SecurityModule, JwtModule],
  exports: [],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UserRepository,
    EmailService,
  ],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(defaultLanguage).forRoutes({ path: 'auth/*path', method: RequestMethod.ALL })
  }
}
