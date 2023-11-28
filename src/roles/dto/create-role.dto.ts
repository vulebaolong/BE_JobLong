import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
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
    @IsNotEmpty({ message: 'Field isActive cannot be empty' })
    @IsBoolean({ message: 'Field isActive must be boolean' })
    isActive: boolean;

    @ApiProperty()
    @IsArray({ message: 'Field permissions must be array' })
    @ArrayNotEmpty({ message: 'Field permissions cannot be array empty' })
    @IsMongoId({ each: true, message: 'Field permissions item of array permissions must be mongooId' })
    permissions: ObjectId[];
}
