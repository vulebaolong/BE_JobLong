import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

export class Company {
    @IsNotEmpty({ message: 'Field company._id cannot be empty' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Field company.name cannot be empty' })
    name: string;

    @IsNotEmpty({ message: 'lField company.ogo cannot be empty' })
    logo: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    name: string;

    @IsArray({ message: 'Field skills must be array' })
    @ArrayNotEmpty({ message: 'Field skills cannot be array empty' })
    @IsString({ each: true, message: 'item of array skills must be string' })
    skills: string[];

    @IsObject({ message: 'Field company must be object' })
    @IsNotEmptyObject({}, { message: 'Field company can not object empty' })
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: 'Field location cannot be empty' })
    location: string;

    @IsNotEmpty({ message: 'Field salary cannot be empty' })
    @IsNumber({}, { message: 'Field salary must be number' })
    salary: number;

    @IsNotEmpty({ message: 'Field quantity cannot be empty' })
    @IsNumber({}, { message: 'Field quantity must be number' })
    quantity: number;

    @IsNotEmpty({ message: 'Field level cannot be empty' })
    level: string;

    @IsNotEmpty({ message: 'Field description cannot be empty' })
    description: string;

    @IsNotEmpty({ message: 'Field startDate cannot be empty' })
    // @IsDateString({}, { message: 'StartDate phải là dang date' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Field startDate must be date' })
    startDate: Date;

    @IsNotEmpty({ message: 'Field endDate cannot be empty' })
    // @IsDateString({}, { message: 'EndDate phải là dang date' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Field endDate must be date' })
    endDate: Date;

    @IsNotEmpty({ message: 'Field isActive cannot be empty' })
    @IsBoolean({ message: 'Field isActive must be boolean' })
    isActive: boolean;
}
