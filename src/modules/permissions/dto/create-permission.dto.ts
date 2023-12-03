import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    @IsString({ message: 'Field name must be string' })
    name: string;

    @IsNotEmpty({ message: 'Field apiPath cannot be empty' })
    @IsString({ message: 'Field apiPath must be string' })
    apiPath: string;

    @IsNotEmpty({ message: 'Field method cannot be empty' })
    @IsString({ message: 'Field method must be string' })
    method: string;

    @IsNotEmpty({ message: 'Field module cannot be empty' })
    @IsString({ message: 'Field module must be string' })
    module: string;
}
