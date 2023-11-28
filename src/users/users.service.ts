import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: SoftDeleteModel<UserDocument>,
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
            const hashPassword = await this.hashPassword(registerDto.password);

            return await this.userModel.create({
                ...registerDto,
                password: hashPassword,
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('user already exists');
            }
        }
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

    findOne = async (id: string) => {
        if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException('id must be mongooId');

        return await this.userModel.findOne({ _id: id }).select('-password');
    };

    findOneByUsername = async (username: string) => {
        return await this.userModel.findOne({
            email: username,
        });
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

    findUserByToken = async (refreshToken: string) => {
        return await this.userModel.findOne({ refreshToken }).select('-password');
    };
}
