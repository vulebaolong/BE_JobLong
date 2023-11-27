import { IUser } from 'src/users/users.interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
    constructor(
        @InjectModel(Resume.name)
        private resumeModel: SoftDeleteModel<ResumeDocument>,
    ) {}
    create = async (createResumeDto: CreateResumeDto, user: IUser) => {
        const resume = await this.resumeModel.create({
            ...createResumeDto,
            email: user.email,
            userId: user._id,
            history: [
                {
                    status: createResumeDto.status || 'PENDING',
                    updatedAt: new Date(),
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            ],
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });

        return {
            _id: resume._id,
            createdAt: resume.createdAt,
        };
    };

    findAll = async (currentPage: number, limit: number, qs: string) => {
        const { filter, sort, population } = aqp(qs);
        delete filter.currentPage;
        delete filter.limit;

        const offset = (+currentPage - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;

        const totalItems = (await this.resumeModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.resumeModel
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

    findAllByUserId = async (currentPage: number, limit: number, qs: string, user: IUser) => {
        const { filter, sort, population } = aqp(qs);
        delete filter.currentPage;
        delete filter.limit;

        const offset = (+currentPage - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;

        const totalItems = (await this.resumeModel.find({ ...filter, userId: user._id })).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.resumeModel
            .find({ ...filter, userId: user._id })
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

    findOne = async (id: string) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        const resume = await this.resumeModel.findOne({ _id: id }).where({ isDeleted: { $ne: true } });

        if (!resume) throw new NotFoundException('Not found resume');

        return resume;
    };

    update = async (id: string, updateResumeDto: UpdateResumeDto, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        const { status } = updateResumeDto;

        const historyObj = {
            status,
            updatedAt: new Date(),
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        };

        const updateQuery = {
            status,
            $push: { history: historyObj },
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        };

        return await this.resumeModel.updateOne({ _id: id }, updateQuery);
    };

    remove = async (id: string, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        await this.resumeModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );

        return await this.resumeModel.softDelete({
            _id: id,
        });
    };
}
