import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_RESUMES } from 'src/common/contants/swagger.contants';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags(TAG_MODULE_RESUMES)
@Controller('resumes')
export class ResumesController {
    constructor(private readonly resumesService: ResumesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a resumes' })
    @ApiBody({ type: CreateResumeDto })
    @ResponseMessage('Create a new resume')
    create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
        return this.resumesService.create(createResumeDto, user);
    }

    @Get()
    @ApiBearerAuth()
    @ResponseMessage('find all resumes with panigation')
    findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return this.resumesService.findAll(+currentPage, +limit, qs);
    }

    @Get('by-user')
    @ApiBearerAuth()
    @ResponseMessage('find all resumes of user with panigation')
    findAllByUserId(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
        @User() user: IUser,
    ) {
        return this.resumesService.findAll(+currentPage, +limit, qs, user);
    }

    @Get(':id')
    @ApiBearerAuth()
    @ResponseMessage('find a resume by id')
    findOne(@Param('id') id: string) {
        return this.resumesService.findOne(id);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ResponseMessage('update a resume')
    updateStatus(
        @Param('id') id: string,
        @Body() updateResumeDto: UpdateResumeDto,
        @User() user: IUser,
    ) {
        return this.resumesService.update(id, updateResumeDto, user);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ResponseMessage('remove a resume by id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.resumesService.remove(id, user);
    }
}
