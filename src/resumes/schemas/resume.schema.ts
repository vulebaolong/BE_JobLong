import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TStatus } from '../dto/create-resume.dto';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ collection: 'resumes', timestamps: true })
export class Resume {
    @Prop()
    email: string;

    @Prop()
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    url: string;

    @Prop({ default: 'PENDING' })
    status: TStatus;

    @Prop()
    companyId: mongoose.Schema.Types.ObjectId;

    @Prop()
    jobId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        status: TStatus;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        };
    }[];

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

export const ResumeSchema = SchemaFactory.createForClass(Resume);
