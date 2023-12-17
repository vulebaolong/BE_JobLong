import { IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    name: string;

    @IsString()
    @IsEmail({}, { message: 'Field email must be type email' })
    @IsNotEmpty({ message: 'Field email cannot be empty' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Field password cannot be empty' })
    password: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Field age cannot be empty' })
    age: number;

    @IsString()
    @IsNotEmpty({ message: 'Field gender cannot be empty' })
    gender: string;

    @IsString()
    @IsNotEmpty({ message: 'Field address cannot be empty' })
    address: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Field role cannot be empty' })
    @IsMongoId({ message: 'Field role must be mongooId' })
    role: ObjectId;
}

export class CreateUserHrDto extends PartialType(CreateUserDto) {
    @IsNotEmpty({ message: 'Field company cannot be empty' })
    @IsMongoId({ message: 'Field company must be mongooId' })
    company: ObjectId;
}
