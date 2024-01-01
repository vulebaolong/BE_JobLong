import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from '../../../modules/companies/schemas/company.schema';

export type JobDocument = HydratedDocument<Job>;

@Schema({ collection: 'jobs', timestamps: true })
export class Job {
    @Prop()
    @ApiProperty()
    name: string;

    @Prop()
    @ApiProperty()
    skills: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
    @ApiProperty()
    company: mongoose.Schema.Types.ObjectId;

    @Prop()
    @ApiProperty()
    location: string;

    @Prop()
    @ApiProperty()
    salary: number;

    @Prop()
    @ApiProperty()
    quantity: number;

    @Prop()
    @ApiProperty()
    level: string;

    @Prop()
    @ApiProperty()
    description: string;

    @Prop()
    @ApiProperty()
    startDate: Date;

    @Prop()
    @ApiProperty()
    endDate: Date;

    @Prop()
    @ApiProperty()
    isActive: boolean;

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

export const JobSchema = SchemaFactory.createForClass(Job);
