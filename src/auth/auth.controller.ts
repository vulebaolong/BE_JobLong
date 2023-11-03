import { Controller, Post, Get, UseGuards, Body, Res, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { I_User } from 'src/users/users.interface';
import { Response } from 'express';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get()
    getHello(): string {
        return 'hello';
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDto })
    @Post('login')
    @ResponseMessage('user login')
    async handleLogin(@Req() req: { user: I_User }, @Res({ passthrough: true }) response: Response) {
        return await this.authService.login(req.user, response);
    }

    @Public()
    @ApiBody({ type: RegisterDto })
    @ApiOperation({ summary: 'Create a user by user' })
    @Post('register')
    async handleRegister(@Body() register: RegisterDto) {
        const newUser = await this.authService.register(register);

        return {
            _id: newUser._id, //id của user được tạo
            createdAt: newUser.createdAt, //thời gian tạo user
        };
    }
}
