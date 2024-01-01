import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_PERMISSIONS } from '../../common/contants/swagger.contants';
import { User } from '../../common/decorators/user.decorator';
import {
    ApiCreatePermission,
    ApiDeletePermission,
    ApiGetListPermissions,
    ApiGetPermission,
    ApiGetPermissionsByUser,
    ApiRestorePermission,
    ApiUpdatePermission,
} from './permissions.apply-decorators';

@ApiTags(TAG_MODULE_PERMISSIONS)
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Post()
    @ApiCreatePermission()
    create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
        return this.permissionsService.create(createPermissionDto, user);
    }

    @Get()
    @ApiGetListPermissions()
    findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return this.permissionsService.findAll(+currentPage, +limit, qs);
    }

    @Get('by-user')
    @ApiGetPermissionsByUser()
    findAllByUser(@User() user: IUser) {
        return this.permissionsService.findAllByUser(user);
    }

    @Get(':id')
    @ApiGetPermission()
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(id);
    }

    @Patch(':id')
    @ApiUpdatePermission()
    update(
        @Param('id') id: string,
        @Body() updatePermissionDto: UpdatePermissionDto,
        @User() user: IUser,
    ) {
        return this.permissionsService.update(id, updatePermissionDto, user);
    }

    @Delete(':id')
    @ApiDeletePermission()
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.permissionsService.remove(id, user);
    }

    @Patch('restore/:id')
    @ApiRestorePermission()
    restore(@Param('id') id: string, @User() user: IUser) {
        return this.permissionsService.restore(id, user);
    }
}
