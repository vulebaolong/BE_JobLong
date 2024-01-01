import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreatedResponse, OkResponse, UpdatedResponse } from '../../common/swagger/swagger';
import { Company } from './schemas/company.schema';
import { Public } from '../../common/decorators/public.decorator';
import { UpdateCompanyDto } from './dto/update-company.dto';

export const ApiCreateCompany = () => {
    const mes = 'Create a new company';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        ApiBody({ type: CreateCompanyDto }),
        CreatedResponse(mes, Company),
    );
};

export const ApiGetListCompanies = () => {
    const mes = 'Get list companies with pagination';
    return applyDecorators(
        Public(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Company, true),
    );
};

export const ApiGetCompany = () => {
    const mes = 'Get a company by id';
    return applyDecorators(
        Public(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Company, false),
    );
};

export const ApiUpdateCompany = () => {
    const mes = 'Update a company by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiBody({ type: UpdateCompanyDto }),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiDeleteCompany = () => {
    const mes = 'Delete a company by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiDeleteHardCompany = () => {
    const mes = 'Delete hard a company by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, false, false, {
            acknowledged: true,
            deletedCount: 1,
        }),
    );
};

export const ApiRestoreCompany = () => {
    const mes = 'Restore a company by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};
