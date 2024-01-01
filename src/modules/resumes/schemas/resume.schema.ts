import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TStatus } from '../dto/create-resume.dto';
import { Company } from '../../../modules/companies/schemas/company.schema';
import { Job } from '../../../modules/jobs/schemas/job.schemas';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../modules/users/schemas/user.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ collection: 'resumes', timestamps: true })
export class Resume {
    @Prop()
    @ApiProperty()
    email: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @ApiProperty()
    user: mongoose.Schema.Types.ObjectId;

    @Prop()
    @ApiProperty()
    url: string;

    @Prop({ default: 'PENDING' })
    @ApiProperty()
    status: TStatus;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
    @ApiProperty()
    company: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Job.name })
    @ApiProperty()
    job: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.Array })
    @ApiProperty()
    history: {
        status: TStatus;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        };
    }[];

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

export const ResumeSchema = SchemaFactory.createForClass(Resume);
