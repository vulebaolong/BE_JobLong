import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_RESUMES } from '../../common/contants/swagger.contants';
import { User } from '../../common/decorators/user.decorator';
import {
    ApiCreateResume,
    ApiDeleteResume,
    ApiGetListResumes,
    ApiGetListResumesByUser,
    ApiGetResume,
    ApiRestoreResume,
    ApiUpdateResume,
} from './resumes.apply-decorators';

@ApiTags(TAG_MODULE_RESUMES)
@Controller('resumes')
export class ResumesController {
    constructor(private readonly resumesService: ResumesService) {}

    @Post()
    @ApiCreateResume()
    async create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
        return await this.resumesService.create(createResumeDto, user);
    }

    @Get()
    @ApiGetListResumes()
    async findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return await this.resumesService.findAll(+currentPage, +limit, qs);
    }

    @Get('by-user')
    @ApiGetListResumesByUser()
    async findAllByUserId(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
        @User() user: IUser,
    ) {
        return await this.resumesService.findAll(+currentPage, +limit, qs, user);
    }

    @Get(':id')
    @ApiGetResume()
    async findOne(@Param('id') id: string) {
        return await this.resumesService.findOne(id);
    }

    @Patch(':id')
    @ApiUpdateResume()
    async updateStatus(
        @Param('id') id: string,
        @Body() updateResumeDto: UpdateResumeDto,
        @User() user: IUser,
    ) {
        return await this.resumesService.update(id, updateResumeDto, user);
    }

    @Delete(':id')
    @ApiDeleteResume()
    async remove(@Param('id') id: string, @User() user: IUser) {
        return await this.resumesService.remove(id, user);
    }

    @Patch('restore/:id')
    @ApiRestoreResume()
    restore(@Param('id') id: string, @User() user: IUser) {
        return this.resumesService.restore(id, user);
    }
}
