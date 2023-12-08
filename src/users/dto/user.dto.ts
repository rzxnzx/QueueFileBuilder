import { IsEmail, IsString } from "class-validator";

export class User {
    
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}