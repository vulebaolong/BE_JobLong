import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { I_User } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from './schemas/job.schemas';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(Job.name)
        private jobModel: SoftDeleteModel<JobDocument>,
    ) {}

    create = async (createJobDto: CreateJobDto, user: I_User) => {
        const job = await this.jobModel.create({
            ...createJobDto,
            createdBy: {
                _id: user._id,
                email: user.email,
            },
        });

        return {
            _id: job._id,
            createdAt: job.createdAt,
        };
    };

    findAll() {
        return `This action returns all jobs`;
    }

    findOne(id: number) {
        return `This action returns a #${id} job`;
    }

    update = async (id: string, updateJobDto: UpdateJobDto, user: I_User) => {
        return await this.jobModel.updateOne(
            { _id: id },
            {
                ...updateJobDto,
                updatedBy: {
                    _id: user._id,
                    email: user.email,
                },
            },
        );
    };

    remove(id: number) {
        return `This action removes a #${id} job`;
    }
}
