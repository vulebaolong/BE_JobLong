import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    @IsString({ message: 'Field name must be string' })
    name: string;

    @IsNotEmpty({ message: 'Field address cannot be empty' })
    @IsString({ message: 'Field address must be string' })
    address: string;

    @IsNotEmpty({ message: 'Field description cannot be empty' })
    @IsString({ message: 'Field description must be string' })
    description: string;

    @IsNotEmpty({ message: 'Field logo cannot be empty' })
    @IsString({ message: 'Field logo must be string' })
    logo: string;

    @IsNotEmpty({ message: 'Field logoName cannot be empty' })
    @IsString({ message: 'Field logoName must be string' })
    logoName: string;
}
