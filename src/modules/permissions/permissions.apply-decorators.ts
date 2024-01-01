import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { OkResponse, UpdatedResponse } from '../../common/swagger/swagger';
import { Permission } from './schemas/permission.schema';

export const ApiCreatePermission = () => {
    const mes = 'Create a new permission';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        ApiBody({ type: CreatePermissionDto }),
        OkResponse(mes, Permission),
    );
};

export const ApiGetListPermissions = () => {
    const mes = 'Get list permissions with pagination';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Permission, true),
    );
};

export const ApiGetPermission = () => {
    const mes = 'Get a permission by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Permission),
    );
};

export const ApiGetPermissionsByUser = () => {
    const mes = 'Get list permissions by user';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Permission, true),
    );
};

export const ApiUpdatePermission = () => {
    const mes = 'Update a permission by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiDeletePermission = () => {
    const mes = 'Delete a permission by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiRestorePermission = () => {
    const mes = 'Restore a permission by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};
