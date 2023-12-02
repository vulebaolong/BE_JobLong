import { Module } from '@nestjs/common';
import { SubscribersModule } from './subscribers/subscribers.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { DatabasesModule } from './databases/databases.module';
import { FirebaseModule } from './firebase/frebase.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { JobsModule } from './jobs/jobs.module';
import { ResumesModule } from './resumes/resumes.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mail/mail.module';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        HealthModule,
        AuthModule,
        UsersModule,
        PermissionsModule,
        RolesModule,
        JobsModule,
        CompaniesModule,
        ResumesModule,
        SubscribersModule,
        MailModule,
        FilesModule,
        FirebaseModule,
        DatabasesModule,
    ],
})
export class RootModule {}
