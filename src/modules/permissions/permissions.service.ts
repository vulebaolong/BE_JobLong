import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { IUser } from '../users/users.interface';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectModel(Permission.name)
        private permissionModel: SoftDeleteModel<PermissionDocument>,
    ) {}

    create = async (createPermissionDto: CreatePermissionDto, user: IUser) => {
        const { name, apiPath, method, module } = createPermissionDto;

        const permissionExist = await this.permissionModel.findOne({ apiPath, method });

        if (permissionExist) throw new ConflictException(`Field apiPath or method already exist`);

        const permission = await this.permissionModel.create({
            name,
            apiPath,
            method,
            module,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });

        return {
            _id: permission._id,
            createdAt: permission.createdAt,
        };
    };

    findAll = async (currentPage: number, limit: number, qs: string) => {
        const { filter, sort, population } = aqp(qs);
        delete filter.currentPage;
        delete filter.limit;

        const offset = (+currentPage - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;

        const totalItems = (await this.permissionModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.permissionModel
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

    findOne = async (id: string) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        return await this.permissionModel.findOne({ _id: id });
    };

    update = async (id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

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
    };

    remove = async (id: string, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        await this.permissionModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );

        return await this.permissionModel.softDelete({
            _id: id,
        });
    };
}
