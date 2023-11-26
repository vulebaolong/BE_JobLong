import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";

@Schema({ collection: 'resumes', timestamps: true })
export class Resume {
    @Prop()
    email: string;

    @Prop({ type: Object })
    userId: { _id: mongoose.Schema.Types.ObjectId; name: string };

    @Prop()
    url: string;

    @Prop()
    status: string;

    @Prop({ type: Object })
    companyId: { _id: mongoose.Schema.Types.ObjectId; name: string };

    @Prop({ type: Object })
    jobId: { _id: mongoose.Schema.Types.ObjectId; name: string };
}
