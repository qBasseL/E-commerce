import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req, Res, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignupDTO, SignupWithGmailDTO } from './dto/signup.dto';
import { LoginDTO, LoginWithGmailDTO } from './dto/login.dto';
import { ConfrimEmailDto } from './dto/confirmEmail.dto';
import { ResendConfrimEmailDto } from './dto/resendEmail.dto';
import type { Request, Response } from 'express';
import { WatchInterceptor } from 'src/common/interceptor';

@UsePipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  stopAtFirstError: true
}))
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  public async Signup(
    @Body() body: SignupDTO,
  ) {
    const user = await this.authenticationService.Signup(body)
    return user
  }

  @Post('signup-with-google')
  public async SignupWithGmail(
    @Body() body: SignupWithGmailDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const { status, credentials } = await this.authenticationService.SignupWithGmail(body.idToken)
    res.status(status)
    return credentials
  }

  @UseInterceptors(WatchInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public Login(
    @Body() body: LoginDTO,
    @Req() req: Request
  ) {
    return this.authenticationService.Login(body)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login-with-google')
  public LoginWithGmail(
    @Body() body: LoginWithGmailDTO
  ) {
    return this.authenticationService.LoginWithGmail(body.idToken)
  }

  @HttpCode(HttpStatus.OK)
  @Patch('confirm-email')
  public async ConfirmEmail(
    @Body() body: ConfrimEmailDto
  ) {
    await this.authenticationService.ConfirmSignup(body)
  }

  @HttpCode(HttpStatus.OK)
  @Patch('resend-confirm-email')
  public async ResendConfirmSignup(
    @Body() body: ResendConfrimEmailDto
  ) {
    await this.authenticationService.ResendConfirmSignup(body)
  }

}
