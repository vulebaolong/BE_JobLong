import { IsIn, IsMongoId, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ObjectId } from 'mongoose';

// export enum EStatus {
//     PENDING = 'PENDING',
//     REVIEWING = 'REVIEWING',
//     APPROVED = 'APPROVED',
//     REJECTED = 'REJECTED',
// }

export type TStatus = 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';

export class CreateResumeDto {
    // @ApiProperty()
    // @IsEmail({}, { message: 'Email không hợp lệ' })
    // @IsNotEmpty({ message: 'Email cannot be empty' })
    // email: string;

    // @ApiProperty()
    // @IsNotEmpty({ message: 'userId cannot be empty' })
    // @IsMongoId()
    // userId: ObjectId;

    @IsNotEmpty({ message: 'Url cannot be empty' })
    @IsUrl({}, { message: 'Field url must be url' })
    url: string;

    // @IsNotEmpty({ message: 'Status cannot be empty' })
    @IsOptional()
    @IsIn(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'], {
        message: `Status invalid, must be 1 of those 'PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'`,
    })
    status: TStatus;

    @IsNotEmpty({ message: 'Field companyId cannot be empty' })
    @IsMongoId({ message: 'Field companyId must be mongooId' })
    company: ObjectId;

    @IsNotEmpty({ message: 'companyId cannot be empty' })
    @IsMongoId({ message: 'Field companyId must be mongooId' })
    job: ObjectId;
}
