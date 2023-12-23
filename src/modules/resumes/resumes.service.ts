import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import aqp from 'api-query-params';
import { IUser } from '../users/users.interface';

@Injectable()
export class ResumesService {
    private readonly logger = new Logger(ResumesService.name);

    constructor(
        @InjectModel(Resume.name)
        private resumeModel: Model<ResumeDocument>,
    ) {}
    create = async (createResumeDto: CreateResumeDto, user: IUser) => {
        try {
            const { url, company, job } = createResumeDto;

            return await this.resumeModel.create({
                url,
                company,
                job,
                user: user._id,
                history: [
                    {
                        status: createResumeDto.status || 'PENDING',
                        updatedAt: new Date(),
                        updatedBy: { _id: user._id, email: user.email },
                    },
                ],
                createdBy: { _id: user._id, email: user.email },
            });
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    findAll = async (currentPage: number, limit: number, qs: string, user?: IUser) => {
        try {
            const { filter, sort, population, projection } = aqp(qs);
            delete filter.currentPage;
            delete filter.limit;
            const queryFilter = user ? { ...filter, user: user._id } : filter;

            const offset = (+currentPage - 1) * +limit;
            const defaultLimit = +limit ? +limit : 10;

            const totalItems = (await this.resumeModel.find(queryFilter)).length;
            const totalPages = Math.ceil(totalItems / defaultLimit);

            const result = await this.resumeModel
                .find(queryFilter)
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

    findOne = async (id: string) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const resume = await this.resumeModel.findOne({ _id: id });

            if (!resume) throw new NotFoundException('Not found resume');

            return resume;
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    update = async (id: string, updateResumeDto: UpdateResumeDto, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const { status, url } = updateResumeDto;

            const historyObj = {
                status,
                updatedAt: new Date(),
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            };

            const updateQuery = {
                ...updateResumeDto,
                $push: { history: historyObj },
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            };

            return await this.resumeModel.updateOne({ _id: id }, updateQuery);
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    remove = async (id: string, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            return await this.resumeModel.updateOne(
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

            return await this.resumeModel.updateOne(
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
