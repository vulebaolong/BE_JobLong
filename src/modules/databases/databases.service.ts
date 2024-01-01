import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { INIT_PERMISSIONS } from './sample';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Permission, PermissionDocument } from '../permissions/schemas/permission.schema';
import { Role, RoleDocument } from '../roles/schemas/role.schema';
import { UsersService } from '../users/users.service';
import { Model } from 'mongoose';
import { ROLE_ADMIN, ROLE_USER } from '../../common/contants/role.contants';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name);

    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(Permission.name)
        private permissionModel: Model<PermissionDocument>,

        @InjectModel(Role.name)
        private roleModel: Model<RoleDocument>,

        private configService: ConfigService,
        private usersService: UsersService,
    ) {}

    onModuleInit = async () => {
        this.logger.log(`The module Databases has been initialized.`);

        const isInit = this.configService.get<string>('SHOULD_INIT');
        if (isInit === 'false') return;

        if (await this.checkCountModel('Start')) return this.logger.log(`=> Not create database`);

        await this.createPermission();

        await this.createRole();

        await this.createUser();

        if (await this.checkCountModel('End'))
            return this.logger.log(`=> database init created successfully`);
    };

    checkCountModel = async (mes?: string) => {
        const countUser = await this.userModel.count();
        const countPermission = await this.permissionModel.count();
        const countRole = await this.roleModel.count();
        this.logger.log(
            `countUser: ${countUser} / countRole: ${countRole} / countPermission: ${countPermission} => ${mes}`,
        );
        return countUser > 0 && countRole > 0 && countPermission > 0;
    };

    createPermission = async () => {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
    };

    createRole = async () => {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
            {
                name: ROLE_ADMIN,
                description: 'Admin thì full quyền :v',
                isActive: true,
                permissions: permissions,
            },
            {
                name: ROLE_USER,
                description: 'Người dùng/Ứng viên sử dụng hệ thống',
                isActive: true,
                permissions: [], //không set quyền, chỉ cần add ROLE
            },
        ]);
    };

    createUser = async () => {
        const adminRole = await this.roleModel.findOne({ name: ROLE_ADMIN });
        const userRole = await this.roleModel.findOne({ name: ROLE_USER });
        await this.userModel.insertMany([
            {
                name: "I'm admin",
                email: 'admin@gmail.com',
                password: await this.usersService.hashPassword(
                    this.configService.get<string>('INIT_PASSWORD'),
                ),
                age: 69,
                gender: 'MALE',
                address: 'VietNam',
                role: adminRole?._id,
            },
            {
                name: "I'm Hỏi Dân IT",
                email: 'vulebaolong@gmail.com',
                password: await this.usersService.hashPassword(
                    this.configService.get<string>('INIT_PASSWORD'),
                ),
                age: 96,
                gender: 'MALE',
                address: 'VietNam',
                role: adminRole?._id,
            },
            {
                name: "I'm normal user",
                email: 'user@gmail.com',
                password: await this.usersService.hashPassword(
                    this.configService.get<string>('INIT_PASSWORD'),
                ),
                age: 69,
                gender: 'MALE',
                address: 'VietNam',
                role: userRole?._id,
            },
        ]);
    };
}
