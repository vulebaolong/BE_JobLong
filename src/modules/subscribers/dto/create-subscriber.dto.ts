import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDefined, IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateSubscriberDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    @IsString({ message: 'Field name must be string' })
    name: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Field email must be type email' })
    @IsNotEmpty({ message: 'Field email cannot be empty' })
    email: string;

    @ApiProperty()
    @IsArray({ message: 'Field skills must be array' })
    @ArrayNotEmpty({ message: 'Field skills cannot be array empty' })
    @IsString({ each: true, message: 'item of array skills must be string' })
    skills: string[];
}
