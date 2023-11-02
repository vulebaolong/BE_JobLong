import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from "./../decorator/customize";
import { I_User } from 'src/users/users.interface';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a company' })
    @ApiBody({ type: CreateCompanyDto })
    @ApiBearerAuth()
    create(@Body() createCompanyDto: CreateCompanyDto, @User() user: I_User) {
        return this.companiesService.create(createCompanyDto, user);
    }

    @Get()
    @ApiBearerAuth()
    findAll() {
        return this.companiesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        return this.companiesService.update(+id, updateCompanyDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.companiesService.remove(+id);
    }
}
