import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger";
import { ResponseMessage } from "src/common/decorators/response-message.decorator";
import { CreatedResponse, OkResponse, UpdatedResponse } from "src/common/swagger/swagger";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "src/modules/roles/schemas/role.schema";
import { UpdateRoleDto } from "./dto/update-role.dto";

export const ApiCreateRole = () => {
    const mes = 'Create a new role';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        ApiBody({ type: CreateRoleDto }),
        CreatedResponse(mes, Role),
    );
};

export const ApiGetListRoles = () => {
    const mes = 'Get roles with pagination';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Role, true),
    );
};

export const ApiGetRole = () => {
    const mes = 'Get a role by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Role, false),
    );
};

export const ApiUpdateRole = () => {
    const mes = 'Update a role by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiBody({ type: UpdateRoleDto }),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiDeleteRole = () => {
    const mes = 'Delete a role by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, false, false, { deleted: 1 }),
    );
};

export const ApiRestoreRole = () => {
    const mes = 'Restore a role by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, false, false, { restored: 1 }),
    );
};