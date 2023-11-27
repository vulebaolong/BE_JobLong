import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

export class Company {
    @IsNotEmpty({ message: '_id cannot be empty' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'name cannot be empty' })
    name: string;

    @IsNotEmpty({ message: 'logo cannot be empty' })
    logo: string;
}

export class CreateJobDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name job cannot be empty' })
    name: string;

    @ApiProperty()
    @IsArray({ message: 'skills phải là mảng' })
    @ArrayNotEmpty({ message: 'skills phải là mảng không trống' })
    @IsString({ each: true, message: 'item của mảng skills phải là string' })
    skills: string[];

    @ApiProperty()
    @IsObject({ message: 'company phải là object' })
    @IsNotEmptyObject({}, { message: 'company phải là object không rỗng' })
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @ApiProperty()
    @IsNotEmpty({ message: 'Location cannot be empty' })
    location: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Salary cannot be empty' })
    @IsNumber({}, { message: 'Salary phải là số' })
    salary: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Salary cannot be empty' })
    @IsNumber({}, { message: 'Salary phải là số' })
    quantity: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Level cannot be empty' })
    level: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description cannot be empty' })
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'StartDate cannot be empty' })
    // @IsDateString({}, { message: 'StartDate phải là dang date' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'StartDate phải là dạng date' })
    startDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'EndDate cannot be empty' })
    // @IsDateString({}, { message: 'EndDate phải là dang date' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'EndDate phải có định dạng là date' })
    endDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'isActive cannot be empty' })
    @IsBoolean({ message: 'isActive phải là boolean' })
    isActive: boolean;
}
