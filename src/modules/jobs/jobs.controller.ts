import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_JOBS } from '../../common/contants/swagger.contants';
import { User } from '../../common/decorators/user.decorator';
import {
    ApiCreateJob,
    ApiDeleteJob,
    ApiGetJob,
    ApiGetListJob,
    ApiRestoreJob,
    ApiUpdateJob,
} from './job.apply-decorators';

@ApiTags(TAG_MODULE_JOBS)
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Post()
    @ApiCreateJob()
    async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
        return await this.jobsService.create(createJobDto, user);
    }

    @Get()
    @ApiGetListJob()
    async findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return await this.jobsService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @ApiGetJob()
    async findOne(@Param('id') id: string, @Query() qs: string) {
        return await this.jobsService.findOne(id, qs);
    }

    @Patch(':id')
    @ApiUpdateJob()
    async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
        return await this.jobsService.update(id, updateJobDto, user);
    }

    @Delete(':id')
    @ApiDeleteJob()
    async remove(@Param('id') id: string, @User() user: IUser) {
        return await this.jobsService.remove(id, user);
    }

    @Patch('restore/:id')
    @ApiRestoreJob()
    restore(@Param('id') id: string, @User() user: IUser) {
        return this.jobsService.restore(id, user);
    }
}
