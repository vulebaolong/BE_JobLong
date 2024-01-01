import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from '../users/users.interface';
import { TAG_MODULE_COMPANIES } from '../../common/contants/swagger.contants';
import { User } from '../../common/decorators/user.decorator';
import {
    ApiCreateCompany,
    ApiDeleteCompany,
    ApiDeleteHardCompany,
    ApiGetCompany,
    ApiGetListCompanies,
    ApiRestoreCompany,
    ApiUpdateCompany,
} from './companies.apply-decorators';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags(TAG_MODULE_COMPANIES)
@Controller({
    version: '1',
    path: 'companies',
})
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Post()
    @ApiCreateCompany()
    create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
        return this.companiesService.create(createCompanyDto, user);
    }

    @Get()
    @ApiGetListCompanies()
    findAll(
        @Query('currentPage') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return this.companiesService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    @ApiGetCompany()
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @Patch(':id')
    @ApiUpdateCompany()
    update(
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
        @User() user: IUser,
    ) {
        return this.companiesService.update(id, updateCompanyDto, user);
    }

    @Delete(':id')
    @ApiDeleteCompany()
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.companiesService.remove(id, user);
    }

    @Delete('hard/:id')
    @ApiDeleteHardCompany()
    removeHard(@Param('id') id: string, @User() user: IUser) {
        return this.companiesService.removeHard(id, user);
    }

    @Patch('restore/:id')
    @ApiRestoreCompany()
    restore(@Param('id') id: string, @User() user: IUser) {
        return this.companiesService.restore(id, user);
    }
}
