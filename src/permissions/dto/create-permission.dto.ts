import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    @IsString({ message: 'Field name must be string' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field apiPath cannot be empty' })
    @IsString({ message: 'Field apiPath must be string' })
    apiPath: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field method cannot be empty' })
    @IsString({ message: 'Field method must be string' })
    method: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field module cannot be empty' })
    @IsString({ message: 'Field module must be string' })
    module: string;
}
