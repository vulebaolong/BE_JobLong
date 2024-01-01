import { Controller, Post, Get, Body, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_AUTH } from '../../common/contants/swagger.contants';
import { User } from '../../common/decorators/user.decorator';
import { ApiLogin, ApiRefresh, ApiRegister, ApiLogout, ApiAcount } from './auth.apply-decorators';

@ApiTags(TAG_MODULE_AUTH)
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Post('login')
    @ApiLogin()
    async handleLogin(@Req() req: { user: IUser }, @Res({ passthrough: true }) response: Response) {
        return await this.authService.login(req.user, response);
    }

    @Post('register')
    @ApiRegister()
    async handleRegister(@Body() register: RegisterDto) {
        return await this.authService.register(register);
    }

    @Get('refresh')
    @ApiRefresh()
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.processNewToken(refreshToken, response);
    }

    @Post('logout')
    @ApiLogout()
    async handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
        return await this.authService.logout(user, response);
    }

    @Get('account')
    @ApiAcount()
    async getAcount(@User() user: IUser) {
        return await this.usersService.findOne(user._id);
    }
}
