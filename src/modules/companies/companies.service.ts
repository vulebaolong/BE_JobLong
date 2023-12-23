import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../users/users.interface';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class CompaniesService {
    private readonly logger = new Logger(CompaniesService.name);

    constructor(
        @InjectModel(Company.name)
        private companyModel: Model<CompanyDocument>,
        private readonly filesService: FilesService,
    ) {}

    create = async (createCompanyDto: CreateCompanyDto, user: IUser) => {
        try {
            return await this.companyModel.create({
                ...createCompanyDto,
                createdBy: {
                    _id: user._id,
                    email: user.email,
                },
            });
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    findAll = async (currentPage: number, limit: number, ps: string) => {
        try {
            const { filter, sort, population, projection } = aqp(ps);
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
                .select(projection)
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
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    findOne = async (id: string) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const company = await this.companyModel.findOne({ _id: id });

            if (!company) throw new NotFoundException(`company ${id} not found`);

            return company;
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    update = async (id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            return await this.companyModel.updateOne(
                { _id: id },
                {
                    ...updateCompanyDto,
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            );
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    remove = async (id: string, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            return await this.companyModel.updateOne(
                { _id: id },
                {
                    isDeleted: true,
                    deletedAt: Date.now(),
                    deletedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            );
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    removeHard = async (id: string, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const company = await this.companyModel.findById(id);

            if (!company) throw new NotFoundException(`company ${id} not found`);

            await this.filesService.remove(company.logoName);

            return await this.companyModel.deleteOne({ _id: id });
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    restore = async (id: string, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            return await this.companyModel.updateOne(
                { _id: id },
                {
                    isDeleted: false,
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            );
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };
}
