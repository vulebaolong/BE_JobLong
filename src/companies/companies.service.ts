import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name)
        private companyModel: SoftDeleteModel<UserDocument>,
    ) {}

    async create(createCompanyDto: CreateCompanyDto) {
        return await this.companyModel.create(createCompanyDto);
    }

    findAll() {
        return `This action returns all companies`;
    }

    findOne(id: number) {
        return `This action returns a #${id} company`;
    }

    update(id: number, updateCompanyDto: UpdateCompanyDto) {
        return `This action updates a #${id} company ${updateCompanyDto}`;
    }

    remove(id: number) {
        return `This action removes a #${id} company`;
    }
}
