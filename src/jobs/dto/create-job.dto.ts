import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Company } from 'src/users/dto/create-user.dto';

export class CreateJobDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name job không được để trống' })
    name: string;

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    skills: string[];

    @ApiProperty()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @ApiProperty()
    @IsNotEmpty({ message: 'Location không được để trống' })
    location: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Salary không được để trống' })
    @IsNumber({}, { message: 'Salary phải là số' })
    salary: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Salary không được để trống' })
    @IsNumber({}, { message: 'Salary phải là số' })
    quantity: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Level không được để trống' })
    level: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description không được để trống' })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'StartDate không được để trống' })
    @IsDateString({}, { message: 'StartDate phải là dang date' })
    startDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'EndDate không được để trống' })
    @IsDateString({}, { message: 'EndDate phải là dang date' })
    endDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean({ message: 'isActive phải là boolean' })
    isActive: boolean;
}


