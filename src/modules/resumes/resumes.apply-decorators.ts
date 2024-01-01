import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CreatedResponse, OkResponse, UpdatedResponse } from '../../common/swagger/swagger';
import { CreateResumeDto } from './dto/create-resume.dto';
import { Resume } from './schemas/resume.schema';
import { UpdateResumeDto } from './dto/update-resume.dto';

export const ApiCreateResume = () => {
    const mes = 'Create a new resume';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ApiBody({ type: CreateResumeDto }),
        ResponseMessage(mes),
        CreatedResponse(mes, Resume),
    );
};

export const ApiGetListResumes = () => {
    const mes = 'Get list resumes with pagination';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Resume, true),
    );
};

export const ApiGetListResumesByUser = () => {
    const mes = 'Get list resumes with pagination by user';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Resume, true),
    );
};

export const ApiGetResume = () => {
    const mes = 'Get a resume by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Resume, false),
    );
};

export const ApiUpdateResume = () => {
    const mes = 'Update a resume by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiBody({ type: UpdateResumeDto }),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiDeleteResume = () => {
    const mes = 'Delete a resume by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiRestoreResume = () => {
    const mes = 'Restore a resume by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};
