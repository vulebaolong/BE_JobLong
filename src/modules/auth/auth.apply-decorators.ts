import { UseGuards, applyDecorators } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto, LoginResSwagger } from './dto/login.dto';
import { OkResponse } from '../../common/swagger/swagger';
import { RegisterDto } from './dto/register.dto';
import { UserResSwagger } from '../users/schemas/user.schema';

export const ApiLogin = () => {
    const mes = 'Login account';
    return applyDecorators(
        Public(),
        UseGuards(LocalAuthGuard),
        UseGuards(ThrottlerGuard),
        ApiBody({ type: LoginDto }),
        ResponseMessage(mes),
        ApiOperation({ summary: mes }),
        OkResponse(mes, false, false, LoginResSwagger),
    );
};

export const ApiRegister = () => {
    const mes = 'Register account';
    return applyDecorators(
        Public(),
        ResponseMessage(mes),
        ApiBody({ type: RegisterDto }),
        ApiOperation({ summary: mes }),
        OkResponse(mes, false, false, {
            _id: '656b7034bf50be0543fe1970',
            createdAt: '2023-12-02T17:58:12.902Z',
        }),
    );
};

export const ApiRefresh = () => {
    const mes = 'Get user by refresh token';
    return applyDecorators(
        Public(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, false, false, LoginResSwagger),
    );
};

export const ApiLogout = () => {
    const mes = 'Logout account';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, false, false, {
            _id: '6568bb1b75c8dee238498abb',
        }),
    );
};

export const ApiAcount = () => {
    const mes = 'Get user infomation';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, false, false, UserResSwagger),
    );
};
