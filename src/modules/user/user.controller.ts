import { Controller, Get, MaxFileSizeValidator, ParseFilePipe, Patch, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth, fileFieldValidation, localMulter, RoleEnum, TokenTypeEnums, User } from 'src/common';
import type { IMulter, } from 'src/common'
import type { HUserDocument, } from 'src/model';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Auth([RoleEnum.User], TokenTypeEnums.Access_Token)
  @Get('profile')
  public Profile(
    @User() user: HUserDocument
  ) {
    return { user: user, }
  }


  @UseInterceptors(FileInterceptor('attachment', localMulter({ fileSize: 5, folder: 'User', validations: fileFieldValidation.image })))
  @Auth([RoleEnum.User], TokenTypeEnums.Access_Token)
  @Patch('profile-image')
  public ProfileImage(
    @User() user: HUserDocument,
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: true,
      validators: [new MaxFileSizeValidator({
        maxSize: 5 * 1024 * 1024,
        errorMessage: 'Exceeded file maximum size please upload a picture 5mb or less'
      })]
    })) file: IMulter
  ) {
    return { user: user, file }
  }

  @UseInterceptors(FilesInterceptor('attachments', 3, localMulter({ fileSize: 5, folder: 'User', validations: fileFieldValidation.image })))
  @Auth([RoleEnum.User], TokenTypeEnums.Access_Token)
  @Patch('profile-cover-image')
  public ProfileCoverImage(
    @User() user: HUserDocument,
    @UploadedFiles(new ParseFilePipe({
      fileIsRequired: true,
      validators: [new MaxFileSizeValidator({
        maxSize: 5 * 1024 * 1024,
        errorMessage: 'Exceeded file maximum size please upload a picture 5mb or less'
      })]
    })) files: IMulter[]
  ) {
    return { user: user, files }
  }
}
