import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    name: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: 'Field email cannot be empty' })
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Field password cannot be empty' })
    password: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'Field age cannot be empty' })
    age: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Field gender cannot be empty' })
    gender: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Field address cannot be empty' })
    address: string;
}
