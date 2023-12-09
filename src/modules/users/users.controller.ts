import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from './users.interface';
import { TAG_MODULE_USER } from 'src/common/contants/swagger.contants';
import { User } from 'src/common/decorators/user.decorator';
import {
    ApiCreateUser,
    ApiDeleteUser,
    ApiGetListUser,
    ApiGetUser,
    ApiRestoreUser,
    ApiUpdateUser,
} from './users.apply-decorators';

@ApiTags(TAG_MODULE_USER)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiCreateUser()
    async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
        return await this.usersService.create(createUserDto, user);
    }

    @Get()
    @ApiGetListUser()
    async findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return await this.usersService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @ApiGetUser()
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(id);
    }

    @Patch(':id')
    @ApiUpdateUser()
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @User() user: IUser,
    ) {
        return await this.usersService.update(id, updateUserDto, user);
    }

    @Delete(':id')
    @ApiDeleteUser()
    async remove(@Param('id') id: string, @User() user: IUser) {
        return await this.usersService.remove(id, user);
    }

    @Patch('restore/:id')
    @ApiRestoreUser()
    restore(@Param('id') id: string, @User() user: IUser) {
        return this.usersService.restore(id, user);
    }
}
