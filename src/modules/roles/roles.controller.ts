import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_ROLES } from '../../common/contants/swagger.contants';
import { User } from '../../common/decorators/user.decorator';
import {
    ApiCreateRole,
    ApiDeleteRole,
    ApiGetListRoles,
    ApiGetRole,
    ApiRestoreRole,
    ApiUpdateRole,
} from './roles.apply-decorators';

@ApiTags(TAG_MODULE_ROLES)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    @ApiCreateRole()
    create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
        return this.rolesService.create(createRoleDto, user);
    }

    @Get()
    @ApiGetListRoles()
    findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return this.rolesService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @ApiGetRole()
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @Patch(':id')
    @ApiUpdateRole()
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
        return this.rolesService.update(id, updateRoleDto, user);
    }

    @Delete(':id')
    @ApiDeleteRole()
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.rolesService.remove(id, user);
    }

    @Patch('restore/:id')
    @ApiRestoreRole()
    restore(@Param('id') id: string, @User() user: IUser) {
        return this.rolesService.restore(id, user);
    }
}
