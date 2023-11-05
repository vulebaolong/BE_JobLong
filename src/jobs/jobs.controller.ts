import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorator/customize';
import { I_User } from 'src/users/users.interface';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a job' })
    @ApiBody({ type: CreateJobDto })
    @ApiBearerAuth()
    async create(@Body() createJobDto: CreateJobDto, @User() user: I_User) {
        return await this.jobsService.create(createJobDto, user);
    }

    @Get()
    findAll() {
        return this.jobsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobsService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'update a job' })
    @ApiBody({ type: UpdateJobDto })
    @ApiBearerAuth()
    async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: I_User) {
        return await this.jobsService.update(id, updateJobDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.jobsService.remove(+id);
    }
}
