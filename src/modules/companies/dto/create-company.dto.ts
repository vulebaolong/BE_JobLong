import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    @IsString({ message: 'Field name must be string' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field address cannot be empty' })
    @IsString({ message: 'Field address must be string' })
    address: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field description cannot be empty' })
    @IsString({ message: 'Field description must be string' })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Field logo cannot be empty' })
    @IsString({ message: 'Field logo must be string' })
    logo: string;
}
