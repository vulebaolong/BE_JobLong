import { Controller, Post, Get, UseGuards, Body, Res, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_AUTH } from 'src/contants/swagger.contants';

@ApiTags(TAG_MODULE_AUTH)
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @UseGuards(ThrottlerGuard)
    @Post('login')
    @ResponseMessage('Login account')
    @ApiBody({ type: LoginDto })
    @ApiOperation({ summary: 'Login account' })
    async handleLogin(@Req() req: { user: IUser }, @Res({ passthrough: true }) response: Response) {
        return await this.authService.login(req.user, response);
    }

    @Public()
    @Post('register')
    @ResponseMessage('Register account')
    @ApiBody({ type: RegisterDto })
    @ApiOperation({ summary: 'Register account' })
    async handleRegister(@Body() register: RegisterDto) {
        const newUser = await this.authService.register(register);

        return {
            _id: newUser._id, //id của user được tạo
            createdAt: newUser.createdAt, //thời gian tạo user
        };
    }

    @Public()
    @Get('refresh')
    @ApiOperation({ summary: 'Get user by refresh token' })
    @ResponseMessage('Get user by refresh token')
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.processNewToken(refreshToken, response);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout user' })
    @ResponseMessage('Logout user')
    async handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        return await this.authService.logout(user, response);
    }

    @Get('account')
    @ApiOperation({ summary: 'Get user infomation' })
    @ResponseMessage('Get user infomation')
    async getAcount(@User() user: IUser) {
        return await this.usersService.findOne(user._id);
    }
}
