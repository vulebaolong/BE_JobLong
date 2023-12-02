import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IUser } from './users.interface';
import { TAG_MODULE_USER } from 'src/contants/swagger.contants';

@ApiTags(TAG_MODULE_USER)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ResponseMessage('create a new user')
    @ApiBearerAuth()
    @ApiBody({ type: CreateUserDto })
    @ApiOperation({ summary: 'Create a user by admin' })
    async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
        const newUser = await this.usersService.create(createUserDto, user);

        return {
            _id: newUser._id, //id của user được tạo
            createdAt: newUser.createdAt, //thời gian tạo user
        };
    }

    @Get()
    @ResponseMessage('Get users with pagination')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get users with pagination' })
    async findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return await this.usersService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @ResponseMessage('Get a user by id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a user by id' })
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(id);
    }

    @Patch()
    @ResponseMessage('Update a user')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a user' })
    async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
        return await this.usersService.update(updateUserDto, user);
    }

    @Delete(':id')
    @ResponseMessage('Delete a user by id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a user by id' })
    async remove(@Param('id') id: string, @User() user: IUser) {
        return await this.usersService.remove(id, user);
    }
}
