import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RoleEnum, } from '../enum';
import { roleName, } from '../decorator';
import { AuthRequest } from '../interface/request.interface';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const req = context.switchToHttp().getRequest<AuthRequest>();

    const role = this.reflector.getAllAndOverride<RoleEnum[]>(roleName, [context.getHandler(), context.getClass()])

    if (!role) {
      throw new UnauthorizedException('User not authenticated')
    }

    const user = req.user

    if (!role.includes(Number(user.role))) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
