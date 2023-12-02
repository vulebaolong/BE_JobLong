import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_PERMISSIONS } from 'src/common/contants/swagger.contants';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags(TAG_MODULE_PERMISSIONS)
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new permission' })
    @ResponseMessage('Create a new permission')
    @ApiBody({ type: CreatePermissionDto })
    create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
        return this.permissionsService.create(createPermissionDto, user);
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get permissions with pagination' })
    findAll(@Query('currentPage') currentPage: string, @Query('limit') limit: string, @Query() qs: string) {
        return this.permissionsService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @ApiBearerAuth()
    @ResponseMessage('Get a permission')
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
        return this.permissionsService.update(id, updatePermissionDto, user);
    }

    @Delete(':id')
    @ResponseMessage('Delete a permission')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.permissionsService.remove(id, user);
    }
}
