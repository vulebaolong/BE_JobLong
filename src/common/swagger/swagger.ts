import { INestApplication } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    DocumentBuilder,
    SwaggerModule,
    getSchemaPath,
} from '@nestjs/swagger';

import {
    TAG_MODULE_AUTH,
    TAG_MODULE_COMPANIES,
    TAG_MODULE_FILES,
    TAG_MODULE_HEALTH,
    TAG_MODULE_JOBS,
    TAG_MODULE_MAIL,
    TAG_MODULE_PERMISSIONS,
    TAG_MODULE_RESUMES,
    TAG_MODULE_ROLES,
    TAG_MODULE_SUBSCRIBERS,
    TAG_MODULE_USER,
} from '../../common/contants/swagger.contants';
import { Company } from '../../modules/companies/schemas/company.schema';
import { Job } from '../../modules/jobs/schemas/job.schemas';
import { Permission } from '../../modules/permissions/schemas/permission.schema';
import { Resume } from '../../modules/resumes/schemas/resume.schema';
import { Role } from '../../modules/roles/schemas/role.schema';
import { Subscriber } from '../../modules/subscribers/schemas/subscriber.schema';
import { User } from '../../modules/users/schemas/user.schema';
import { SwaggerTheme } from 'swagger-themes';

export const useSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('JobLong APIs Document')
        .setDescription('All Modules APIs')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag(TAG_MODULE_HEALTH)
        .addTag(TAG_MODULE_AUTH)
        .addTag(TAG_MODULE_USER)
        .addTag(TAG_MODULE_PERMISSIONS)
        .addTag(TAG_MODULE_ROLES)
        .addTag(TAG_MODULE_JOBS)
        .addTag(TAG_MODULE_COMPANIES)
        .addTag(TAG_MODULE_RESUMES)
        .addTag(TAG_MODULE_SUBSCRIBERS)
        .addTag(TAG_MODULE_MAIL)
        .addTag(TAG_MODULE_FILES)
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [User, Permission, Role, Job, Company, Resume, Subscriber],
    });

    const theme = new SwaggerTheme('v3');
    const options = {
        explorer: true,
        customCss: theme.getBuffer('dark'),
        swaggerOptions: {
            persistAuthorization: true,
        },
    };

    SwaggerModule.setup('swagger', app, document, options);
};

export const CreatedResponse = (mes: string, $ref: any) => {
    return ApiCreatedResponse({
        schema: {
            properties: {
                statusCode: { example: 201 },
                message: { example: mes },
                data: {
                    $ref: getSchemaPath($ref),
                },
            },
        },
    });
};

export const UpdatedResponse = (mes: string) => {
    return ApiCreatedResponse({
        schema: {
            properties: {
                statusCode: { example: 201 },
                message: { example: mes },
                data: {
                    example: {
                        acknowledged: true,
                        modifiedCount: 1,
                        upsertedId: null,
                        upsertedCount: 0,
                        matchedCount: 1,
                    },
                },
            },
        },
    });
};

export const OkResponse = (mes?: string, $ref?: any, pagination = false, data?: any) => {
    if ($ref) {
        if (pagination) {
            return ApiOkResponse({
                schema: {
                    properties: {
                        statusCode: { example: 200 },
                        message: { example: mes },
                        data: {
                            properties: {
                                meta: {
                                    type: 'object',
                                    properties: {
                                        currentPage: { type: 'number', example: 1 },
                                        pageSize: { type: 'number', example: 1 },
                                        totalPages: { type: 'number', example: 4 },
                                        totalItems: { type: 'number', example: 4 },
                                    },
                                },
                                result: {
                                    type: 'array',
                                    items: {
                                        $ref: getSchemaPath($ref),
                                    },
                                },
                            },
                        },
                    },
                },
            });
        }

        return ApiOkResponse({
            schema: {
                properties: {
                    statusCode: { example: 200 },
                    message: { example: mes },
                    data: {
                        $ref: getSchemaPath($ref),
                    },
                },
            },
        });
    }

    if (data) {
        if (pagination) {
            return ApiOkResponse({
                schema: {
                    properties: {
                        statusCode: { example: 200 },
                        message: { example: mes },
                        data: {
                            properties: {
                                meta: {
                                    type: 'object',
                                    properties: {
                                        currentPage: { type: 'number', example: 1 },
                                        pageSize: { type: 'number', example: 1 },
                                        totalPages: { type: 'number', example: 4 },
                                        totalItems: { type: 'number', example: 4 },
                                    },
                                },
                                result: {
                                    type: 'array',
                                    example: data,
                                },
                            },
                        },
                    },
                },
            });
        }

        return ApiOkResponse({
            schema: {
                properties: {
                    statusCode: { example: 200 },
                    message: { example: mes },
                    data: { example: data },
                },
            },
        });
    }

    return ApiOkResponse({
        schema: {
            properties: {
                statusCode: { example: 200 },
                message: { example: mes },
                data: { example: [] },
            },
        },
    });
};
