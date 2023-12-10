import { IsEmail, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
    @IsNotEmpty({ message: 'Field name cannot be empty' })
    name: string;

    @IsEmail({}, { message: 'Field email must be type email' })
    @IsNotEmpty({ message: 'Field email cannot be empty' })
    email: string;

    @IsNotEmpty({ message: 'Field password cannot be empty' })
    password: string;

    @IsNotEmpty({ message: 'Field age cannot be empty' })
    age: number;

    @IsNotEmpty({ message: 'Field gender cannot be empty' })
    gender: string;

    @IsNotEmpty({ message: 'Field address cannot be empty' })
    address: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Field role cannot be empty' })
    @IsMongoId({ message: 'Field role must be mongooId' })
    role: ObjectId;
}

export class CreateUserHrDto extends PartialType(CreateUserDto) {
    @IsNotEmpty({ message: 'Field company cannot be empty' })
    @IsMongoId({ message: 'Field company must be mongooId' })
    company: ObjectId;
}

// export class RegisterUserDto extends CreateUserDto{
//     @ApiProperty()
//     @IsNotEmpty({ message: 'Field role cannot be empty' })
//     @IsMongoId({ message: 'Field role must be mongooId' })
//     role: ObjectId;
// @IsObject({ message: 'Field company must be object' })
// @IsNotEmptyObject({}, { message: 'Field company cannot be object empty' })
// @ValidateNested()
// @Type(() => Company)
// company: Company;
// }
