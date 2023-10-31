import { Controller, Request, Post, Get, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './decorator/customize';
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { LoginDto } from './auth/dto/login.dto';

@ApiTags('Authen')
@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private authService: AuthService,
    ) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(
        @Request() req
    ) {
        return this.authService.login(req.user);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
