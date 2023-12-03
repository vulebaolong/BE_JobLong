import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ collection: 'jobs', timestamps: true })
export class Job {
    @Prop()
    @ApiProperty()
    name: string;

    @Prop()
    @ApiProperty()
    skills: string[];

    @Prop({ type: Object })
    @ApiProperty()
    company: { _id: mongoose.Schema.Types.ObjectId; name: string; logo: string };

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

export const JobSchema = SchemaFactory.createForClass(Job);
