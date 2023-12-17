import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import util from 'util';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../users/users.interface';

@Injectable()
export class SubscribersService {
    private readonly logger = new Logger(SubscribersService.name);

    constructor(
        @InjectModel(Subscriber.name)
        private subscriberModel: Model<SubscriberDocument>,
    ) {}

    create = async (createSubscriberDto: CreateSubscriberDto, user: IUser) => {
        try {
            const { email, name, skills } = createSubscriberDto;

            const subscriber = await this.subscriberModel.create({
                email,
                name,
                skills,
                createdBy: {
                    _id: user._id,
                    email: user.email,
                },
            });

            return {
                _id: subscriber._id,
                createdAt: subscriber.createdAt,
            };
        } catch (error) {
            if (error.code === 11000)
                throw new ConflictException(`Duplicate key ${util.inspect(error.keyValue)}`);
            this.logger.debug(error);
            throw error;
        }
    };

    getSkill = async (user: IUser) => {
        try {
            return await this.subscriberModel.findOne({ email: user.email }, { skills: 1 });
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    findAll = async (currentPage: number, limit: number, ps: string) => {
        try {
            const { filter, sort, population } = aqp(ps);
            delete filter.currentPage;
            delete filter.limit;

            const offset = (+currentPage - 1) * +limit;
            const defaultLimit = +limit ? +limit : 10;

            const totalItems = (await this.subscriberModel.find(filter)).length;
            const totalPages = Math.ceil(totalItems / defaultLimit);

            const result = await this.subscriberModel
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
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    findOne = async (id: string) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const subscriber = await this.subscriberModel.findById(id);

            if (!subscriber) throw new NotFoundException('subscriber not found');

            return subscriber;
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    update = async (updateSubscriberDto: UpdateSubscriberDto, user: IUser) => {
        try {
            const { email, name, skills } = updateSubscriberDto;

            return await this.subscriberModel.updateOne(
                { email: user.email },
                {
                    email,
                    name,
                    skills,
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
                {
                    upsert: true,
                },
            );
        } catch (error) {
            if (error.code === 11000)
                throw new ConflictException(`Duplicate key ${util.inspect(error.keyValue)}`);
            this.logger.debug(error);
            throw error;
        }
    };

    remove = async (id: string, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            return await this.subscriberModel.updateOne(
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

            return await this.subscriberModel.updateOne(
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
