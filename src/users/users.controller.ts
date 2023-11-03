import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { I_User } from './users.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: 'Create a user by admin' })
    @ApiBody({ type: CreateUserDto })
    @ApiBearerAuth()
    @ResponseMessage('create a new user')
    async create(@Body() createUserDto: CreateUserDto, @User() user: I_User) {
        const newUser = await this.usersService.create(createUserDto, user);

        return {
            _id: newUser._id, //id của user được tạo
            createdAt: newUser.createdAt, //thời gian tạo user
        };
    }

    @Get()
    @ApiBearerAuth()
    async findAll(@Query('page') currentPage: string, @Query('limit') limit: string, @Query() qs: string) {
        return await this.usersService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @ApiBearerAuth()
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(id);
    }

    @Patch()
    @ApiBearerAuth()
    async update(@Body() updateUserDto: UpdateUserDto, @User() user: I_User) {
        return await this.usersService.update(updateUserDto, user);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ResponseMessage('Delete a user')
    async remove(@Param('id') id: string, @User() user: I_User) {
        return await this.usersService.remove(id, user);
    }
}
