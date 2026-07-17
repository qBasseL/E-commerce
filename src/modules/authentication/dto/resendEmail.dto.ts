import { IsEmail } from "class-validator";

export class ResendConfrimEmailDto {


    @IsEmail({})
    email!: string;

}