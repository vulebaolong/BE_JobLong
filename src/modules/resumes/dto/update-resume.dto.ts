import { CreateResumeDto, TStatus } from './create-resume.dto';
import { IsIn, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsNotEmpty({ message: 'Field status cannot be empty' })
    @IsIn(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'], {
        message: `Status invalid, must be 1 of those 'PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'`,
    })
    status: TStatus;
}

// class UpdatedBy {
//     @IsNotEmpty({ message: 'UpdatedBy/_id cannot be empty' })
//     _id: mongoose.Schema.Types.ObjectId;

//     @IsNotEmpty({ message: 'Email cannot be empty' })
//     @IsEmail({}, { message: 'Email không hợp lệ' })
//     email: string;
// }

// class History {
//     @IsNotEmpty({ message: 'Status cannot be empty' })
//     status: TStatus;

//     @IsNotEmpty({ message: 'updatedAt cannot be empty' })
//     updatedAt: Date;
//     updatedBy: UpdatedBy;
// }
// export class UpdateResumeDto extends PartialType(CreateResumeDto) {
//     @IsNotEmpty({ message: 'history cannot be empty' })
//     history: History;
// }
