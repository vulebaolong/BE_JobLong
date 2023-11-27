import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';

export class Company {
    @IsNotEmpty({ message: '_id cannot be empty' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'name cannot be empty' })
    name: string;
}

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Age cannot be empty' })
    age: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Gender cannot be empty' })
    gender: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address cannot be empty' })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Role cannot be empty' })
    role: string;

    @ApiProperty()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}
