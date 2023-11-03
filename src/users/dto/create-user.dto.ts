import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    name: string
}

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password không được để trống' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Number không được để trống' })
    age: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Gender không được để trống' })
    gender: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address không được để trống' })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Role không được để trống' })
    role: string;

    @ApiProperty()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: string;
}

export class RegisterUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password không được để trống' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Number không được để trống' })
    age: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Gender không được để trống' })
    gender: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address không được để trống' })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Role không được để trống' })
    role: string;

    @ApiProperty()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: string;
}
