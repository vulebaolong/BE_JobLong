import { ObjectId } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: {
        _id: string;
        name: string;
    };
    permissions?: {
        _id: string;
        name: string;
        apiPatch: string;
        module: string;
    }[];
}
