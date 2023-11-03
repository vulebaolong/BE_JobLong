import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I_User } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    validateUser = async (username: string, pass: string): Promise<UserDocument> => {
        const user = await this.usersService.findOneByUsername(username);
        if (!user) return null;

        const isValid = this.usersService.isValidPassword(pass, user.password);
        if (!isValid) return null;

        return user;
    };

    login = async (user: I_User, response: Response) => {
        const { _id, name, email, role } = user;

        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id,
            name,
            email,
            role,
        };

        const refresh_token = this.createRefreshToken(payload);

        await this.usersService.updateUserToken(refresh_token, _id);

        response.cookie('refresh_token', refresh_token, {
            maxAge: ms(this.configService.get<string>('JWT_FRESH_EXPIRE')),
            httpOnly: true,
        });

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token,
            user: {
                _id,
                name,
                email,
                role,
            },
        };
    };

    register = async (registerDto: RegisterDto) => {
        return await this.usersService.register(registerDto);
    };

    createRefreshToken(payload: any) {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_FRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_FRESH_EXPIRE')) / 1000,
        });
        return refresh_token;
    }
}
