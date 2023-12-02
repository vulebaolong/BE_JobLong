import {
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    ValidateNested,
} from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';
import { Type } from 'class-transformer';

export class Company {
    @IsNotEmpty({ message: 'Field company._id cannot be empty' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Field company.name cannot be empty' })
    name: string;
}

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

    @IsNotEmpty({ message: 'Field role cannot be empty' })
    @IsMongoId({ message: 'Field role must be mongooId' })
    role: ObjectId;

    @IsObject({ message: 'Field company must be object' })
    @IsNotEmptyObject({}, { message: 'Field company cannot be object empty' })
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}

// export class RegisterUserDto extends CreateUserDto{
//     @ApiProperty()
//     @IsNotEmpty({ message: 'Field role cannot be empty' })
//     @IsMongoId({ message: 'Field role must be mongooId' })
//     role: ObjectId;
// }
