import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_JOBS } from 'src/contants/swagger.contants';

@ApiTags(TAG_MODULE_JOBS)
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new job' })
    @ResponseMessage('Create a new job')
    @ApiBody({ type: CreateJobDto })
    async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
        return await this.jobsService.create(createJobDto, user);
    }

    @Get()
    @Public()
    @ResponseMessage('Get jobs with pagination')
    findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return this.jobsService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @Public()
    @ResponseMessage('Get a job')
    findOne(@Param('id') id: string) {
        return this.jobsService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ApiBody({ type: UpdateJobDto })
    @ApiOperation({ summary: 'update a job' })
    async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
        return await this.jobsService.update(id, updateJobDto, user);
    }

    @Delete(':id')
    @ResponseMessage('Delete a job')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.jobsService.remove(id, user);
    }
}