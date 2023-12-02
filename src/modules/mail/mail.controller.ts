import { Controller, Get, Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { Subscriber, SubscriberDocument } from 'src/modules/subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from '../jobs/schemas/job.schemas';
import { TAG_MODULE_MAIL } from 'src/contants/swagger.contants';

@ApiTags(TAG_MODULE_MAIL)
@Controller('mail')
export class MailController {
    private readonly logger = new Logger(MailController.name);

    constructor(
        @InjectModel(Subscriber.name)
        private subscriberModel: SoftDeleteModel<SubscriberDocument>,

        @InjectModel(Job.name)
        private jobModel: SoftDeleteModel<JobDocument>,

        private readonly mailService: MailService,
        private mailerService: MailerService,
    ) {}

    // @Cron(CronExpression.EVERY_30_SECONDS)
    handleCron() {
        this.logger.debug('Called every 30 seconds');
    }

    @Get()
    @Public()
    @ResponseMessage('Test email')
    // @Cron("0 0 0 * * 0") // 0.00 AM every sunday
    async handleTestEmail() {
        const subscribers = await this.subscriberModel.find({});
        for (const subs of subscribers) {
            const subsSkills = subs.skills;
            const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
            if (jobWithMatchingSkills?.length) {
                const jobs = jobWithMatchingSkills.map((job) => {
                    return {
                        name: job.name,
                        company: job.company.name,
                        salary: `${job.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
                        skills: job.skills,
                    };
                });

                await this.mailerService.sendMail({
                    to: 'vulebaolong@gmail.com',
                    from: '"Support Team" <support@example.com>', // override default from
                    subject: 'Welcome to Nice App! Confirm your Email',
                    // html: '<b>welcome bla bla</b>', // HTML body content
                    template: 'new-job',
                    context: {
                        receiver: subs.name,
                        jobs: jobs,
                    },
                });
            }
            //todo
            //build template
        }
    }
}
