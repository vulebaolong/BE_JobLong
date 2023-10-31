import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    isValidPassword(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }

    async create(createUserDto: CreateUserDto) {
        const hashPassword = await this.hashPassword(createUserDto.password);
        const user = await this.userModel.create({
            email: createUserDto.email,
            password: hashPassword,
            name: createUserDto.name,
        });
        return user;
    }

    findAll() {
        return `This action returns all users`;
    }

    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user';
        }
        return await this.userModel.findOne(
            {
                _id: id,
            },
            { password: 0 },
        );
    }

    async findOneByUsername(username: string) {
        return await this.userModel.findOne({
            email: username,
        });
    }

    async update(updateUserDto: UpdateUserDto) {
        return await this.userModel.updateOne(
            {
                _id: updateUserDto._id,
            },
            { ...updateUserDto },
        );
    }

    async remove(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return 'Not found user';
        }
        return await this.userModel.deleteOne({
            _id: id,
        });
    }
}
