import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserHrDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from './users.interface';
import { TAG_MODULE_USER } from '../../common/contants/swagger.contants';
import { User } from '../../common/decorators/user.decorator';
import {
    ApiCreateUser,
    ApiCreateUserHr,
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
    async createUser(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
        return await this.usersService.createUser(createUserDto, user);
    }

    @Post('hr')
    @ApiCreateUserHr()
    async createUserHr(@Body() createUserHrDto: CreateUserHrDto, @User() user: IUser) {
        return await this.usersService.createUserHr(createUserHrDto, user);
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
    async findOne(@Param('id') id: string, @Query() qs: string) {
        return await this.usersService.findOne(id, qs);
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
