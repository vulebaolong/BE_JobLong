import { ObjectId } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: ObjectId;
}
