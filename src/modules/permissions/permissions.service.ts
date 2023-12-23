import { RolesService } from './../roles/roles.service';
import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { IUser } from '../users/users.interface';
import { Model } from 'mongoose';

@Injectable()
export class PermissionsService {
    private readonly logger = new Logger(PermissionsService.name);

    constructor(
        @InjectModel(Permission.name)
        private permissionModel: Model<PermissionDocument>,

        private rolesService: RolesService,
    ) {}

    create = async (createPermissionDto: CreatePermissionDto, user: IUser) => {
        try {
            const { name, apiPath, method, module } = createPermissionDto;

            const permissionExist = await this.permissionModel.findOne({ apiPath, method });

            if (permissionExist)
                throw new ConflictException(`Field apiPath or method already exist`);

            return await this.permissionModel.create({
                name,
                apiPath,
                method,
                module,
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

    findAll = async (currentPage: number, limit: number, qs: any) => {
        try {
            const { filter, sort, population, projection } = aqp(qs);
            delete filter.currentPage;
            delete filter.limit;

            const offset = (+currentPage - 1) * +limit;
            const defaultLimit = +limit ? +limit : 10;

            const totalItems = (
                await this.permissionModel.find({ ...filter, apiPath: new RegExp(qs.apiPath) })
            ).length;
            const totalPages = Math.ceil(totalItems / defaultLimit);

            const result = await this.permissionModel
                .find({ ...filter, apiPath: new RegExp(qs.apiPath) })
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

            const permisstion = await this.permissionModel.findOne({ _id: id });

            if (!permisstion) throw new NotFoundException(`permisstion ${id} not found`);

            return permisstion;
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    findAllByUser = async (user: IUser) => {
        try {
            const role = await this.rolesService.findOne(user.role._id);
            return role.permissions;
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    update = async (id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const { name, apiPath, method, module } = updatePermissionDto;

            return await this.permissionModel.updateOne(
                { _id: id },
                {
                    name,
                    apiPath,
                    method,
                    module,
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

            return await this.permissionModel.updateOne(
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

            return await this.permissionModel.updateOne(
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
