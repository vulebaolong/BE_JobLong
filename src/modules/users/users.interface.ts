import mongoose from 'mongoose';
import { Permission } from '../permissions/schemas/permission.schema';

export interface IUser {
    _id: string;
    name: string;
    password?: string;
    email: string;
    avatar: string;
    role: IRolePopulate;
}

export interface IUserMongoo {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    address: string;

    isDeleted: boolean;
    deletedAt: null | Date;
    deletedBy?: { _id: mongoose.Schema.Types.ObjectId; email: string };

    createdAt: Date;
    createdBy?: { _id: mongoose.Schema.Types.ObjectId; email: string };

    updatedAt: Date;
    updatedBy?: { _id: mongoose.Schema.Types.ObjectId; email: string };

    __v: number;
    refreshToken: string;
    role: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };
    permissions?: Permission[];
}

export interface IRolePopulate {
    _id: string;
    name: string;
}
