import { IsEmail, IsString } from "class-validator";

export class AuthLogin {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}