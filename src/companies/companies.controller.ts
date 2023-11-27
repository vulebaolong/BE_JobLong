import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, ResponseMessage, User } from './../decorator/customize';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@ApiTags('companies')
@Controller({
    version: '1',
    path: 'companies',
})
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a company' })
    @ApiBody({ type: CreateCompanyDto })
    @ApiBearerAuth()
    create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
        return this.companiesService.create(createCompanyDto, user);
    }

    @Get()
    @Public()
    @ApiBearerAuth()
    @ResponseMessage('Get list company with panigation')
    findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string
    ) {
        return this.companiesService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        return this.companiesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Create a company' })
    update(@Param('id') id: string, @Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
        return this.companiesService.update(id, createCompanyDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.companiesService.remove(id, user);
    }
}
