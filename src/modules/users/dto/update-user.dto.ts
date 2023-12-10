// import { OmitType } from '@nestjs/mapped-types';
// import { IsNotEmpty } from 'class-validator';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateUserDto, CreateUserHrDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

// OmitType => bỏ đi 1 key nào đó
// ở đây chúng ta không muốn có password vì cập nhật password chúng ta sẽ xây dựng chức năng riêng
// export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
//     // cần thêm _id trong body
//     @IsNotEmpty({ message: '_id cannot be empty' })
//     _id: string;
// }

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsNotEmpty({ message: 'Field company cannot be empty' })
    @IsMongoId({ message: 'Field company must be mongooId' })
    company: ObjectId;
}
