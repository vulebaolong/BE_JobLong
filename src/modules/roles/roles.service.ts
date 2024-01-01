import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import util from 'util';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../users/users.interface';
import { ROLE_ADMIN } from '../../common/contants/role.contants';

@Injectable()
export class RolesService {
    private readonly logger = new Logger(RolesService.name);

    constructor(
        @InjectModel(Role.name)
        private roleModel: Model<RoleDocument>,
        private configService: ConfigService,
    ) {}

    create = async (createRoleDto: CreateRoleDto, user: IUser) => {
        try {
            const { name, description, isActive, permissions } = createRoleDto;

            return await this.roleModel.create({
                name,
                description,
                isActive,
                permissions,
                createdBy: {
                    _id: user._id,
                    email: user.email,
                },
            });
        } catch (error) {
            if (error.code === 11000)
                throw new ConflictException(`Duplicate key ${util.inspect(error.keyValue)}`);
            this.logger.error(error);
            throw error;
        }
    };

    findAll = async (currentPage: number, limit: number, qs: string) => {
        try {
            const { filter, sort, population } = aqp(qs);
            delete filter.currentPage;
            delete filter.limit;

            const offset = (+currentPage - 1) * +limit;
            const defaultLimit = +limit ? +limit : 10;

            const totalItems = (await this.roleModel.find(filter)).length;
            const totalPages = Math.ceil(totalItems / defaultLimit);

            const result = await this.roleModel
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

            const role = await this.roleModel.findById(id).populate({
                path: 'permissions',
                select: {
                    _id: 1,
                    apiPath: 1,
                    name: 1,
                    method: 1,
                    module: 1,
                },
            });

            if (!role) throw new NotFoundException('role not found');

            return role;
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    findOneByName = async (name: string) => {
        try {
            const role = await this.roleModel.findOne({ name: name });

            if (!role) throw new NotFoundException('role not found');

            return role;
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    update = async (id: string, updateRoleDto: UpdateRoleDto, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const { name, description, isActive, permissions } = updateRoleDto;

            return await this.roleModel.updateOne(
                { _id: id },
                {
                    name,
                    description,
                    isActive,
                    permissions,
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
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

            const role = await this.roleModel.findById(id);
            if (role.name === ROLE_ADMIN) throw new BadRequestException('Cannot delete ROLE_ADMIN');

            return await this.roleModel.updateOne(
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

            return await this.roleModel.updateOne(
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
