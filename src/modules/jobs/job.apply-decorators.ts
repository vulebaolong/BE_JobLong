import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CreatedResponse, OkResponse, UpdatedResponse } from '../../common/swagger/swagger';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './schemas/job.schemas';
import { Public } from '../../common/decorators/public.decorator';
import { UpdateJobDto } from './dto/update-job.dto';

export const ApiCreateJob = () => {
    const mes = 'Create a new job';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Create a new job' }),
        ResponseMessage('Create a new job'),
        ApiBody({ type: CreateJobDto }),
        CreatedResponse(mes, Job),
    );
};

export const ApiGetListJob = () => {
    const mes = 'Get list jobs with pagination';
    return applyDecorators(
        Public(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Job, true),
    );
};

export const ApiGetJob = () => {
    const mes = 'Get a job by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Job, false),
    );
};

export const ApiUpdateJob = () => {
    const mes = 'Update a job by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiBody({ type: UpdateJobDto }),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiDeleteJob = () => {
    const mes = 'Delete a job by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiRestoreJob = () => {
    const mes = 'Restore a job by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};
