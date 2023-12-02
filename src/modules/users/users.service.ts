import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IRolePopulate, IUser } from './users.interface';
import aqp from 'api-query-params';
import { ConfigService } from '@nestjs/config';
import { USER_ROLE } from 'src/modules/databases/sample';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { Role, RoleDocument } from '../roles/schemas/role.schema';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,

        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,

        private configService: ConfigService,
        private roleService: RolesService,
    ) {}

    hashPassword = async (password: string) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    };

    isValidPassword = (password: string, hash: string) => {
        return bcrypt.compareSync(password, hash);
    };

    create = async (createUserDto: CreateUserDto, user: IUser) => {
        try {
            const hashPassword = await this.hashPassword(createUserDto.password);

            return await this.userModel.create({
                ...createUserDto,
                password: hashPassword,
                createdBy: {
                    _id: user._id,
                    email: user.email,
                },
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('user already exists');
            }
        }
    };

    register = async (registerDto: RegisterDto): Promise<UserDocument> => {
        try {
            const { name, email, password, age, gender, address } = registerDto;

            const userExist = await this.userModel.findOne({ email });

            if (userExist) throw new BadRequestException(`Field email: ${email} already exist`);

            const userRole = await this.roleModel.findOne({ name: USER_ROLE });

            if (!userRole) throw new BadRequestException(`There is no ${USER_ROLE} data in the database to assign a default value to the user`);

            const hashPassword = await this.hashPassword(password);

            return await this.userModel.create({
                name,
                email,
                age,
                gender,
                address,
                password: hashPassword,
                role: userRole._id,
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('user already exists');
            }
        }
    };

    update = async (updateUserDto: UpdateUserDto, user: IUser) => {
        try {
            return await this.userModel.updateOne(
                {
                    _id: updateUserDto._id,
                },
                {
                    ...updateUserDto,
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            );
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('email người dùng đã tồn tại');
            }
        }
    };

    remove = async (id: string, user: IUser) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        const userAdmin = await this.userModel.findById(id);

        if (userAdmin.email === this.configService.get<string>('EMAIL_ADMIN')) throw new BadRequestException('Cannot delete admin account');

        await this.userModel.updateOne(
            { _id: id },
            {
                deletedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );

        return await this.userModel.softDelete({
            _id: id,
        });
    };

    updateUserToken = async (refreshToken: string, id: string) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        return await this.userModel.updateOne({ _id: id }, { refreshToken });
    };

    findAll = async (currentPage: number, limit: number, ps: string) => {
        const { filter, sort, population } = aqp(ps);
        delete filter.currentPage;
        delete filter.limit;

        const offset = (+currentPage - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;

        const totalItems = (await this.userModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.userModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort as any)
            .select('-password')
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
    };

    // Get all value a user
    findOne = async (id: string) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        const user = await this.userModel.findOne({ _id: id }).select('-password -refreshToken').populate<IRolePopulate>({ path: 'role', select: 'name' });

        if (!user) throw new NotFoundException('user not exist');

        const userObj = user.toObject();

        if (!('_id' in userObj.role)) throw new BadRequestException(`Role: ${userObj.role} not exsit in collection role`);

        const role = await this.roleService.findOne(userObj.role._id.toString());

        const result = {
            ...userObj,
            permissions: role.permissions,
        };

        return result;
    };

    findOneById = async (id: string) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        const user = await this.userModel
            .findOne({ _id: id })
            .select('-password')
            .populate({ path: 'role', select: { name: 1 } });

        if (!('_id' in user.role)) throw new BadRequestException(`Role: ${user.role} not exsit in collection role`);

        return await this.resultUser(user);
    };

    findOneByUsername = async (username: string) => {
        const user = await this.userModel.findOne({ email: username }).populate<IRolePopulate>({ path: 'role', select: 'name' });

        if (!user) throw new NotFoundException('user not exist');

        const userObj = user.toObject();

        return await this.resultUser(userObj);
    };

    findUserByToken = async (refreshToken: string) => {
        const user = await this.userModel.findOne({ refreshToken }).select('-password').populate<IRolePopulate>({ path: 'role', select: 'name' });

        if (!user) throw new NotFoundException('user not exist');

        const userObj = user.toObject();

        return await this.resultUser(userObj);
    };

    resultUser = async (user: any) => {
        if (!('_id' in user.role)) throw new BadRequestException(`Role: ${user.role} not exsit in collection role`);

        const role = await this.roleService.findOne(user.role._id.toString());

        const result: IUser = {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            password: user.password,
            role: {
                _id: role._id.toString(),
                name: role.name,
            },
            permissions: role.permissions,
        };

        return result;
    };
}
