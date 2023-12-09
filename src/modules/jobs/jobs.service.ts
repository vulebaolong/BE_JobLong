import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/users.interface';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(Job.name)
        private jobModel: Model<JobDocument>,
    ) {}

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
                currentPage,
                pageSize: limit,
                totalPages,
                totalItems,
            },
            result,
        };
    };

    findOne = async (id: string, qs: string) => {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestException('id must be mongooId');

        const { population } = aqp(qs);

        const job = (await this.jobModel.findOne({ _id: id })).populate(population);

        if (!job) throw new NotFoundException('job not found');

        return job;
    };

    update = async (id: string, updateJobDto: UpdateJobDto, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestException('id must be mongooId');

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
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestException('id must be mongooId');

        return await this.jobModel.updateOne(
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
    };

    restore = async (id: string, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestException('id must be mongooId');

        return await this.jobModel.updateOne(
            { _id: id },
            {
                isDeleted: false,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
    };
}
