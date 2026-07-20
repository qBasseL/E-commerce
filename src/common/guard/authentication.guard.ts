import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../utils';
import { Reflector } from '@nestjs/core';
import { TokenTypeEnums } from '../enum';
import { tokenTypeName } from '../decorator';
import { AuthRequest } from '../interface/request.interface';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    let authorization!: string;

    const req = context.switchToHttp().getRequest<AuthRequest>();
    authorization = req.headers['authorization']
    if (!authorization) {
      throw new UnauthorizedException('Missing authorization')
    }

    const [key, token] = authorization.split(' ')
    if (key !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing authorization')
    }


    const tokenType = this.reflector.getAllAndOverride<TokenTypeEnums>(tokenTypeName, [context.getHandler(), context.getClass()])

    if (!tokenType) {
      throw new UnauthorizedException('Cannot access this page')
    }

    try {
      const { user, decoded } = await this.tokenService.decodeToken({ token, tokenType })
      req.user = user;
      req.decoded = decoded;
      return true;
    } catch (error) {
      console.log(error)
      throw error
    }

  }
}
