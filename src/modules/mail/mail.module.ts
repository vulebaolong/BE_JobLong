import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from 'src/modules/subscribers/schemas/subscriber.schema';
import { Job, JobSchema } from '../jobs/schemas/job.schemas';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('EMAIL_HOST'),
                    secure: false,
                    auth: {
                        user: configService.get<string>('EMAIL_AUTH_USER'),
                        pass: configService.get<string>('EMAIL_AUTH_PASS'),
                    },
                },
                preview: configService.get<string>('EMAIL_PREVIEW') === 'true' ? true : false,
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Job.name, schema: JobSchema },
            { name: Subscriber.name, schema: SubscriberSchema },
        ]),
    ],
    controllers: [MailController],
    providers: [MailService],
})
export class MailModule {}
