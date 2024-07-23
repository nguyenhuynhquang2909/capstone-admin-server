import { IsNotEmpty, IsString } from "class-validator";

export class CreateAdminAuthDto {
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}