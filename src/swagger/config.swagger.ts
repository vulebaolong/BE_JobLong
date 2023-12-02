import { DocumentBuilder } from '@nestjs/swagger';
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
} from 'src/contants/swagger.contants';

export const configSwagger = () => {
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
    return { config };
};
