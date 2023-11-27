import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from './schemas/job.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(Job.name)
        private jobModel: SoftDeleteModel<JobDocument>,
    ) { }

    create = async (createJobDto: CreateJobDto, user: IUser) => {
        const job = await this.jobModel.create({
            ...createJobDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });

        return {
            _id: job._id,
            createdAt: job.createdAt,
        };
    };

    findAll = async (currentPage: number, limit: number, qs: string) => {
        const { filter, sort, population } = aqp(qs);
        delete filter.currentPage;
        delete filter.limit;

        const offset = (+currentPage - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;

        const totalItems = (await this.jobModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.jobModel
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
    }

    findOne = async (id: string) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        return await this.jobModel.findOne({ _id: id })
    }

    update = async (id: string, updateJobDto: UpdateJobDto, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        return await this.jobModel.updateOne(
            { _id: id },
            {
                ...updateJobDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
    };

    remove = async (id: string, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        await this.jobModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );

        return await this.jobModel.softDelete({
            _id: id,
        });
    }
}
