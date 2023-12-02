import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
    constructor(private readonly subscribersService: SubscribersService) {}

    @Post()
    @ApiOperation({ summary: 'Create a subscriber' })
    @ApiBody({ type: CreateSubscriberDto })
    @ApiBearerAuth()
    @ResponseMessage('Create a subscriber')
    create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
        return this.subscribersService.create(createSubscriberDto, user);
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get subscriber with pagination' })
    @ResponseMessage('Get subscriber with pagination')
    findAll(@Query('currentPage') currentPage: string, @Query('limit') limit: string, @Query() qs: string) {
        return this.subscribersService.findAll(+currentPage, +limit, qs);
    }

    @Get('skills')
    @SkipCheckPermission()
    @ApiBearerAuth()
    @ResponseMessage('Get subscriber skill')
    getUserSkills(@User() user: IUser) {
        return this.subscribersService.getSkill(user);
    }

    @Get(':id')
    @ApiBearerAuth()
    @ResponseMessage('Get a subscriber')
    findOne(@Param('id') id: string) {
        return this.subscribersService.findOne(id);
    }

    @Patch()
    @SkipCheckPermission()
    @ApiBearerAuth()
    @ApiBody({ type: UpdateSubscriberDto })
    @ApiOperation({ summary: 'update a subscriber' })
    @ResponseMessage('Update a subscriber')
    update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
        return this.subscribersService.update(updateSubscriberDto, user);
    }

    @Delete(':id')
    @ResponseMessage('Delete a subscriber')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.subscribersService.remove(id, user);
    }
}
