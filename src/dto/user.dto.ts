import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDto{
    id:number;

    @IsNotEmpty()
    user_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
    
    role: string;
}