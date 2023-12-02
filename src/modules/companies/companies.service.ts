import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { IUser } from '../users/users.interface';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name)
        private companyModel: SoftDeleteModel<UserDocument>,
    ) { }

    create = async (createCompanyDto: CreateCompanyDto, user: IUser) => {
        return await this.companyModel.create({
            ...createCompanyDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });
    };

    findAll = async (currentPage: number, limit: number, ps: string) => {
        const { filter, sort, population } = aqp(ps);
        delete filter.currentPage;
        delete filter.limit;

        const offset = (+currentPage - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;

        const totalItems = (await this.companyModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.companyModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort as any)
            .populate(population)
            .exec();

        return {
            meta: {
                currentPage, //trang hiện tại
                pageSize: limit, //số lượng bản ghi đã lấy
                totalPages, //tổng số trang với điều kiện query
                totalItems, // tổng số phần tử (số bản ghi)
            },
            result, //kết quả query
        };
    };

    findOne = async (id: string) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        return `This action returns a #${id} company`;
    };

    update = async (id: string, createCompanyDto: CreateCompanyDto, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        return await this.companyModel.updateOne(
            { _id: id },
            {
                ...createCompanyDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
    };

    remove = async (id: string, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        await this.companyModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
        return await this.companyModel.softDelete({ _id: id });
    };
}
