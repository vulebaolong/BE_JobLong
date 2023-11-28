import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';

export type UserDocument = HydratedDocument<Role>;

@Schema({ collection: 'roles', timestamps: true })
export class Role {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    isActive: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Permission.name }] })
    permissions: Permission[];

    // Default
    @Prop()
    isDeleted: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date;

    @Prop({ type: Object })
    createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

    @Prop({ type: Object })
    updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };

    @Prop({ type: Object })
    deletedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
}

export const RoleSchema = SchemaFactory.createForClass(Role);
