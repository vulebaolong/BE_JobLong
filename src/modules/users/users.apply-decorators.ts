import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CreateUserDto, CreateUserHrDto } from './dto/create-user.dto';
import { CreatedResponse, OkResponse, UpdatedResponse } from '../../common/swagger/swagger';
import { User, UserResSwagger } from './schemas/user.schema';

export const ApiCreateUser = () => {
    const mes = 'Create a user by admin';
    return applyDecorators(
        ApiBearerAuth(),
        ApiBody({ type: CreateUserDto }),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        CreatedResponse(mes, User),
    );
};

export const ApiCreateUserHr = () => {
    const mes = 'Create a user hr by admin';
    return applyDecorators(
        ApiBearerAuth(),
        ApiBody({ type: CreateUserHrDto }),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        CreatedResponse(mes, User),
    );
};

export const ApiGetListUser = () => {
    const mes = 'Get users with pagination';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, User, true),
    );
};

export const ApiGetUser = () => {
    const mes = 'Get a user by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, false, false, UserResSwagger),
    );
};

export const ApiUpdateUser = () => {
    const mes = 'Update a user by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiUpdateUserHr = () => {
    const mes = 'Update a user hr by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiDeleteUser = () => {
    const mes = 'Delete a user by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiRestoreUser = () => {
    const mes = 'Restore a user by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};
