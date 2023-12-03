import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TStatus } from '../dto/create-resume.dto';
import { Company } from 'src/modules/companies/schemas/company.schema';
import { Job } from 'src/modules/jobs/schemas/job.schemas';
import { ApiProperty } from '@nestjs/swagger';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ collection: 'resumes', timestamps: true })
export class Resume {
    @Prop()
    @ApiProperty()
    email: string;

    @Prop()
    @ApiProperty()
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    @ApiProperty()
    url: string;

    @Prop({ default: 'PENDING' })
    @ApiProperty()
    status: TStatus;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
    @ApiProperty()
    companyId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Job.name })
    @ApiProperty()
    jobId: mongoose.Schema.Types.ObjectId;

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
    @Prop()
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
