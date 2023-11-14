import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    @ApiProperty()
    @IsString({ message: 'Name phải là string' })
    name: string;

    @IsNotEmpty({ message: 'Address không được để trống' })
    @ApiProperty()
    @IsString({ message: 'Address phải là string' })
    address: string;

    @IsNotEmpty({ message: 'Description không được để trống' })
    @ApiProperty()
    @IsString({ message: 'Description phải là string' })
    description: string;

    @IsNotEmpty({ message: 'Logo không được để trống' })
    @ApiProperty()
    @IsString({ message: 'Logo phải là string' })
    logo: string;
}
