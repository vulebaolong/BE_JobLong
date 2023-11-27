import { PartialType } from '@nestjs/swagger';
import { CreateResumeDto, TStatus } from './create-resume.dto';
import { IsIn, IsNotEmpty } from 'class-validator';

// export class UpdateResumeDto extends PartialType(CreateResumeDto) {}
export class UpdateResumeDto {
     @IsNotEmpty({ message: 'Status cannot be empty' })
     @IsIn(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'], { message: `Status invalid, must be 1 of those 'PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'` })
     status: TStatus;
}
