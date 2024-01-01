import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, CreateUserHrDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IRolePopulate, IUser } from './users.interface';
import aqp from 'api-query-params';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../../modules/auth/dto/register.dto';
import { RolesService } from '../roles/roles.service';
import { plainToClass } from 'class-transformer';
import { ROLE_HR, ROLE_USER } from '../../common/contants/role.contants';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

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

    createUser = async (createUserDto: CreateUserDto, user: IUser) => {
        try {
            const { email, password } = createUserDto;

            const userExist = await this.userModel.findOne({ email });
            if (userExist) throw new BadRequestException(`Field email: ${email} already exist`);

            const hashPassword = await this.hashPassword(password);

            const roleUser = await this.roleService.findOneByName(ROLE_USER);

            const userNew = await this.userModel.create({
                ...createUserDto,
                role: roleUser._id,
                password: hashPassword,
                createdBy: {
                    _id: user._id,
                    email: user.email,
                },
            });

            return plainToClass(User, userNew.toObject());
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    createUserHr = async (createUserHrDto: CreateUserHrDto, user: IUser) => {
        try {
            const { email, password } = createUserHrDto;

            const userExist = await this.userModel.findOne({ email });
            if (userExist) throw new BadRequestException(`Field email: ${email} already exist`);

            const hashPassword = await this.hashPassword(password);

            const roleHr = await this.roleService.findOneByName(ROLE_HR);

            const userNew = await this.userModel.create({
                ...createUserHrDto,
                role: roleHr._id,
                password: hashPassword,
                createdBy: {
                    _id: user._id,
                    email: user.email,
                },
            });

            return plainToClass(User, userNew.toObject());
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };

    register = async (registerDto: RegisterDto) => {
        try {
            const { email, password } = registerDto;

            const userExist = await this.userModel.findOne({ email });
            if (userExist) throw new BadRequestException(`Field email: ${email} already exist`);

            const userRole = await this.roleService.findOneByName(ROLE_USER);

            const hashPassword = await this.hashPassword(password);

            const userNew = await this.userModel.create({
                ...registerDto,
                password: hashPassword,
                role: userRole._id,
            });

            return plainToClass(User, userNew.toObject());
        } catch (error) {
            throw error;
        }
    };

    update = async (id: string, updateUserDto: UpdateUserDto, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            return await this.userModel.updateOne(
                { _id: id },
                {
                    ...updateUserDto,
                    updatedBy: {
                        _id: user._id,
                        email: user.email,
                    },
                },
            );
        } catch (error) {
            if (error.code === 11000) throw new ConflictException('Email already exists');
            if (error.code === 66) throw new BadRequestException(error.message);
            this.logger.error(error);
            throw error;
        }
    };

    remove = async (id: string, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const userAdmin = await this.userModel.findById(id);

            if (userAdmin.email === this.configService.get<string>('EMAIL_ADMIN'))
                throw new BadRequestException('Cannot delete admin account');

            return await this.userModel.updateOne(
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
            this.logger.error(error);
            throw error;
        }
    };

    restore = async (id: string, user: IUser) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            return await this.userModel.updateOne(
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
            this.logger.error(error);
            throw error;
        }
    };

    updateUserToken = async (refreshToken: string, id: string) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            return await this.userModel.updateOne({ _id: id }, { refreshToken });
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    findAll = async (currentPage: number, limit: number, ps: string) => {
        try {
            const { filter, sort, population, projection } = aqp(ps);
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
                .select({ ...projection, password: 0 })
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
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    // Get all value a user
    findOne = async (id: string, ps?: string) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new BadRequestException('id must be mongooId');

            const user = await this.userModel
                .findOne({ _id: id })
                .select('-password -refreshToken')
                .populate<IRolePopulate>([
                    { path: 'role', select: 'name' },
                    { path: 'company', select: 'name' },
                ]);

            if (!user) throw new NotFoundException('user not exist');

            return user;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    findOneByUsername = async (username: string) => {
        try {
            const user = await this.userModel
                .findOne({ email: username })
                .populate<IRolePopulate>({ path: 'role', select: 'name' });

            if (!user) throw new NotFoundException('user not exist');

            return user;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };

    findUserByToken = async (refreshToken: string): Promise<IUser> => {
        try {
            const user = await this.userModel
                .findOne({ refreshToken })
                .select('-password')
                .populate<IRolePopulate>({ path: 'role', select: 'name' });

            if (!user) throw new NotFoundException('user not exist');

            return user.toObject();
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    };
}
