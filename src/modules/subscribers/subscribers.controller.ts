import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/users.interface';
import { User } from '../../common/decorators/user.decorator';
import {
    ApiCreateSubscriber,
    ApiDeleteSubscriber,
    ApiGetListSubscribers,
    ApiGetSkillsOfSubscriber,
    ApiGetSubscriber,
    ApiRestoreSubscriber,
    ApiUpdateSubscriber,
} from './subscribers.apply-decorators';
import { TAG_MODULE_SUBSCRIBERS } from '../../common/contants/swagger.contants';

@ApiTags(TAG_MODULE_SUBSCRIBERS)
@Controller('subscribers')
export class SubscribersController {
    constructor(private readonly subscribersService: SubscribersService) {}

    @Post()
    @ApiCreateSubscriber()
    create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
        return this.subscribersService.create(createSubscriberDto, user);
    }

    @Get()
    @ApiGetListSubscribers()
    findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return this.subscribersService.findAll(+currentPage, +limit, qs);
    }

    @Get('skills')
    @ApiGetSkillsOfSubscriber()
    getUserSkills(@User() user: IUser) {
        return this.subscribersService.getSkill(user);
    }

    @Get(':id')
    @ApiGetSubscriber()
    findOne(@Param('id') id: string) {
        return this.subscribersService.findOne(id);
    }

    @Patch()
    @ApiUpdateSubscriber()
    update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
        return this.subscribersService.update(updateSubscriberDto, user);
    }

    @Delete(':id')
    @ApiDeleteSubscriber()
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.subscribersService.remove(id, user);
    }

    @Patch('restore/:id')
    @ApiRestoreSubscriber()
    restore(@Param('id') id: string, @User() user: IUser) {
        return this.subscribersService.restore(id, user);
    }
}
