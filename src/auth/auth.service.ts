import { Injectable, BadRequestException } from '@nestjs/common';
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
    ) { }

    validateUser = async (username: string, pass: string): Promise<UserDocument> => {
        const user = await this.usersService.findOneByUsername(username);
        if (!user) return null;

        const isValid = this.usersService.isValidPassword(pass, user.password);
        if (!isValid) return null;

        return user;
    };

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
        });
        return refresh_token;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') })

            const user = await this.usersService.findUserByToken(refreshToken)

            if (!user) throw new BadRequestException('Refresh Token không hợp lệ vui lòng đăng nhập lại')

            const { name, email, role } = user;

            return await this.login({ _id: user._id.toString(), name, email, role }, response, 'token refresh')
        } catch (error) {
            throw new BadRequestException('Refresh Token không hợp lệ vui lòng đăng nhập lại')
        }
    }

    login = async (user: I_User, response: Response, sub = 'token login') => {
        const { _id, name, email, role } = user;

        const payload = {
            sub,
            iss: 'from server',
            _id,
            name,
            email,
            role,
        };

        const refresh_token = this.createRefreshToken(payload);

        await this.usersService.updateUserToken(refresh_token, _id);

        response.clearCookie('refresh_token')

        response.cookie('refresh_token', refresh_token, {
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
            httpOnly: true,
        });

        return {
            access_token: this.jwtService.sign(payload),
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

    logout = async (user: I_User, response: Response) => {
        await this.usersService.updateUserToken('', user._id)
        response.clearCookie('refresh_token')
        return 'oke'
    }
}
