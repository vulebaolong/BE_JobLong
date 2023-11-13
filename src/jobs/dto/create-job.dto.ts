import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Company } from 'src/users/dto/create-user.dto';

export class CreateJobDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name job không được để trống' })
    name: string;

    @ApiProperty()
    @IsArray({message: "skills phải là mảng"})
    @ArrayNotEmpty({message: "skills phải là mảng không trống"})
    @IsString({ each: true, message: "item của mảng skills phải là string" })
    skills: string[];

    @ApiProperty()
    @IsObject({message: 'company phải là object'})
    @IsNotEmptyObject({}, {message: 'company phải là object không rỗng'})
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
    // @IsDateString({}, { message: 'StartDate phải là dang date' })
    @Transform(({value}) => new Date(value))
    @IsDate({message: 'StartDate phải là dạng date'})
    startDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'EndDate không được để trống' })
    // @IsDateString({}, { message: 'EndDate phải là dang date' })
    @Transform(({value}) => new Date(value))
    @IsDate({message: 'EndDate phải có định dạng là date'})
    endDate: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean({ message: 'isActive phải là boolean' })
    isActive: boolean;
}


