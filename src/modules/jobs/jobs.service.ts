import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { IUser } from '../users/users.interface';

@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name);

    constructor(
        @InjectModel(Job.name)
        private jobModel: Model<JobDocument>,
    ) {}

    create = async (createJobDto: CreateJobDto, user: IUser) => {
        try {
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
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    findAll = async (currentPage: number, limit: number, qs: string) => {
        try {
            const { filter, sort, population, projection } = aqp(qs);
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
                .select(projection)
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
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    findOne = async (id: string, qs: string) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const { population } = aqp(qs);

            const job = (await this.jobModel.findOne({ _id: id })).populate(population);

            if (!job) throw new NotFoundException('job not found');

            return job;
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    update = async (id: string, updateJobDto: UpdateJobDto, user: IUser) => {
        try {
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
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    remove = async (id: string, user: IUser) => {
        try {
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
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    restore = async (id: string, user: IUser) => {
        try {
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
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };
}
