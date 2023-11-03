import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

// OmitType => bỏ đi 1 key nào đó
// ở đây chúng ta không muốn có password vì cập nhật password chúng ta sẽ xây dựng chức năng riêng
export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    // cần thêm _id trong body
    @IsNotEmpty({ message: '_id không được để trống' })
    _id: string;
}
