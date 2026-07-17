import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth, RoleEnum, TokenTypeEnums, User } from 'src/common';
import type { HUserDocument } from 'src/model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Auth([RoleEnum.User], TokenTypeEnums.Access_Token)
  @Get('profile')
  public Profile(
    @User() user: HUserDocument
  ) {
    return {user: user,}
  }
}
