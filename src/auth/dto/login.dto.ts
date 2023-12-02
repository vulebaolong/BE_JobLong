import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'vulebaolong@gmail.com', description: 'email account' })
    @IsNotEmpty({ message: 'Field username cannot be empty' })
    @IsString({ message: 'Field username must be string' })
    username: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty({ message: 'Field password cannot be empty' })
    @IsString({ message: 'Field password must be string' })
    password: string;
}
