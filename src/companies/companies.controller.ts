import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './../decorator/customize';
import { I_User } from 'src/users/users.interface';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a company' })
    @ApiBody({ type: CreateCompanyDto })
    @ApiBearerAuth()
    create(@Body() createCompanyDto: CreateCompanyDto, @User() user: I_User) {
        return this.companiesService.create(createCompanyDto, user);
    }

    @Get()
    @ApiBearerAuth()
    findAll(
        @Query('page') currentPage: string,
        @Query('limit') limit: string,
        @Query() qs: string,
    ) {
        return this.companiesService.findAll(+currentPage, +limit, qs);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Create a company' })
    update(
        @Param('id') id: string,
        @Body() createCompanyDto: CreateCompanyDto,
        @User() user: I_User,
    ) {
        return this.companiesService.update(id, createCompanyDto, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @User() user: I_User) {
        return this.companiesService.remove(id, user);
    }
}
