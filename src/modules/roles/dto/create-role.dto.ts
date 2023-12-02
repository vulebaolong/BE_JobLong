import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDefined, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    @IsString({ message: 'Field name must be string' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field description cannot be empty' })
    @IsString({ message: 'Field description must be string' })
    description: string;

    @ApiProperty()
    @IsDefined({ message: 'Your message here' })
    @IsNotEmpty({ message: 'Field isActive cannot be empty' })
    @IsBoolean({ message: 'Field isActive must be boolean' })
    isActive: boolean;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field permissions cannot be empty' })
    @ArrayNotEmpty({ message: 'Field permissions cannot be array empty' })
    @IsArray({ message: 'Field permissions must be array' })
    @IsMongoId({ each: true, message: 'Field permissions item of array permissions must be mongooId' })
    permissions: ObjectId[];
}