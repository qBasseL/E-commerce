import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginDTO {

    @IsEmail({})
    email!: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
        minNumbers: 1,
        minUppercase: 1,
        minLowercase: 1,
        minSymbols: 1
    })
    password!: string;

}

export class LoginWithGmailDTO {

    @IsString()
    @IsNotEmpty()
    idToken!: string;

}