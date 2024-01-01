import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from '../../../modules/companies/schemas/company.schema';
import { Role } from '../../../modules/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
    @Prop()
    @ApiProperty()
    name: string;

    @Prop({ unique: true })
    @ApiProperty()
    email: string;

    @Prop()
    @Exclude()
    password: string;

    @Prop()
    @ApiProperty()
    age: number;

    @Prop()
    @ApiProperty()
    gender: string;

    @Prop()
    @ApiProperty()
    address: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
    @ApiProperty()
    company: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
    @ApiProperty()
    role: mongoose.Schema.Types.ObjectId | Role;

    @Prop()
    @ApiProperty()
    refreshToken: string;

    // Default
    @Prop({ default: false })
    @ApiProperty()
    isDeleted: boolean;

    @Prop()
    @ApiProperty()
    createdAt: Date;

    @Prop()
    @ApiProperty()
    updatedAt: Date;

    @Prop()
    @ApiProperty()
    deletedAt: Date;

    @Prop({ type: Object })
    @ApiProperty()
    createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

    @Prop({ type: Object })
    @ApiProperty()
    updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

    @Prop({ type: Object })
    @ApiProperty()
    deletedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserResSwagger = {
    name: 'string',
    email: 'string',
    age: 0,
    gender: 'string',
    address: 'string',
    company: {},
    role: {},
    refreshToken: 'string',
    isDeleted: true,
    createdAt: '2023-12-02T17:11:02.422Z',
    updatedAt: '2023-12-02T17:11:02.422Z',
    deletedAt: '2023-12-02T17:11:02.422Z',
    createdBy: {},
    updatedBy: {},
    deletedBy: {},
    permissions: [
        {
            _id: '648ab415f4328bd3153ee211',
            name: 'Get Company with paginate',
            apiPath: '/api/v1/companies',
            method: 'GET',
            module: 'COMPANIES',
        },
    ],
};
