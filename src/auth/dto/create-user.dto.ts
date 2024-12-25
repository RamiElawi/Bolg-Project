import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(3,12)
    firstName:string;
    @IsString()
    @Length(3,12)
    lastName:string;
    @IsEmail()
    @IsNotEmpty()
    email:string;
    @Length(3)
    password:string;
    @IsString()
    @IsNotEmpty()
    profilePic:string;
}
