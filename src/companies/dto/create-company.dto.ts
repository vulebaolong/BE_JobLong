import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @ApiProperty()
    @IsString({ message: 'Name phải là string' })
    name: string;

    @IsNotEmpty({ message: 'Address cannot be empty' })
    @ApiProperty()
    @IsString({ message: 'Address phải là string' })
    address: string;

    @IsNotEmpty({ message: 'Description cannot be empty' })
    @ApiProperty()
    @IsString({ message: 'Description phải là string' })
    description: string;

    @IsNotEmpty({ message: 'Logo cannot be empty' })
    @ApiProperty()
    @IsString({ message: 'Logo phải là string' })
    logo: string;
}
