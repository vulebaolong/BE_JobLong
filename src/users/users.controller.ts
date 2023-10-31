import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorator/customize';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Public()
    @Post()
    @ApiOperation({ summary: 'Create user' })
    @ApiBody({ type: CreateUserDto })
    create(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return this.usersService.create(createUserDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiBearerAuth()
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch()
    @ApiBearerAuth()
    update(@Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(updateUserDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
