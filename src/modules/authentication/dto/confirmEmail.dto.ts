import { IsEmail, IsString, Matches, } from "class-validator";

export class ConfrimEmailDto {

    @IsEmail({})
    email!: string;

    @Matches(/^\d{6}$/)
    @IsString()
    otp!: string
}