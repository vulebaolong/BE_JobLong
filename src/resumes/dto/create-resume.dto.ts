import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsMongoId, IsNotEmpty, IsUrl } from "class-validator";
import { ObjectId } from "mongoose";

enum EStatus {
    PENDING = 'PENDING',
    REVIEWING = 'REVIEWING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export class CreateResumeDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'userId không được để trống' })
    @IsMongoId()
    userId: ObjectId;
    
    @ApiProperty()
    @IsNotEmpty({ message: 'Url không được để trống' })
    @IsUrl({}, { message: 'Phải là Url' })
    url: string;

    @IsNotEmpty({ message: 'Status không được để trống' })
    @IsIn(Object.values(EStatus), { message: `Status không hợp lệ, phải là 1 trong những ${Object.values(EStatus)}` })
    status: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'companyId không được để trống' })
    @IsMongoId()
    companyId: ObjectId;

    @ApiProperty()
    @IsNotEmpty({ message: 'companyId không được để trống' })
    @IsMongoId()
    jobId: ObjectId;
}
