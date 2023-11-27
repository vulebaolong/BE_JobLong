import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'name cannot be empty' })
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    age: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string;
}
