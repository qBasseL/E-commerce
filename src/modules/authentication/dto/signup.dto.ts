import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { LoginDTO } from "./login.dto";
import { GenderEnum, IsMatch } from "src/common";

export class SignupDTO extends LoginDTO {

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(25)
    @IsString({ message: "Invalid username format" })
    username!: string;

    @ValidateIf((data: any) => {
        return Boolean(data.password)
    })
    @IsMatch('password')
    confirmPassword!: string;

    @IsNotEmpty()
    @IsString()
    gender!: GenderEnum

    @IsOptional()
    @IsString()
    phone?: string

}

export class SignupWithGmailDTO {

    @IsNotEmpty()
    @IsString()
    idToken!: string;



}