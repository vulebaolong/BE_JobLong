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

export const LoginResSwagger = {
    access_token: 'string',
    user: {
        _id: '6568bb1b75c8dee238498abb',
        name: "I'm",
        email: 'email@gmail.com',
        role: {
            _id: '6568bb1a75c8dee238498ab5',
            name: 'ROLE_ADMIN',
        },
        permissions: [
            {
                _id: '648ab415f4328bd3153ee211',
                name: 'Get Company with paginate',
                apiPath: '/api/v1/companies',
                method: 'GET',
                module: 'COMPANIES',
            },
        ],
    },
};
