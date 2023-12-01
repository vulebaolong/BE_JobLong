import { Controller, Post, Get, UseGuards, Body, Res, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IUser } from 'src/users/users.interface';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Get()
    @Public()
    getHello(): string {
        return 'hello';
    }

    @Public()
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDto })
    @ResponseMessage('login')
    async handleLogin(@Req() req: { user: IUser }, @Res({ passthrough: true }) response: Response) {
        return await this.authService.login(req.user, response);
    }

    @Public()
    @Post('register')
    @ApiBody({ type: RegisterDto })
    @ApiOperation({ summary: 'Create a user by user' })
    @ResponseMessage('register')
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
