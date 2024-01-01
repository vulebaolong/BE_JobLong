import { Controller, Get, Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { Subscriber, SubscriberDocument } from '../../modules/subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from '../jobs/schemas/job.schemas';
import { TAG_MODULE_MAIL } from '../../common/contants/swagger.contants';
import { ApiSendMail } from './mail.apply-decorators';
import { Model } from 'mongoose';

@ApiTags(TAG_MODULE_MAIL)
@Controller('mail')
export class MailController {
    private readonly logger = new Logger(MailController.name);

    constructor(
        @InjectModel(Subscriber.name)
        private subscriberModel: Model<SubscriberDocument>,

        @InjectModel(Job.name)
        private jobModel: Model<JobDocument>,

        private readonly mailService: MailService,
        private mailerService: MailerService,
    ) {}

    // @Cron(CronExpression.EVERY_30_SECONDS)
    handleCron() {
        this.logger.debug('Called every 30 seconds');
    }

    @Get()
    @ApiSendMail()
    // @Cron("0 0 0 * * 0") // 0.00 AM every sunday
    async sendEmail() {
        // const subscribers = await this.subscriberModel.find({});
        // for (const subs of subscribers) {
        //     const subsSkills = subs.skills;
        //     const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
        //     if (jobWithMatchingSkills?.length) {
        //         const jobs = jobWithMatchingSkills.map((job) => {
        //             return {
        //                 name: job.name,
        //                 company: job.company.name,
        //                 salary: `${job.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
        //                 skills: job.skills,
        //             };
        //         });
        //         await this.mailerService.sendMail({
        //             to: 'vulebaolong@gmail.com',
        //             from: '"Support Team" <support@example.com>', // override default from
        //             subject: 'Welcome to Nice App! Confirm your Email',
        //             // html: '<b>welcome bla bla</b>', // HTML body content
        //             template: 'new-job',
        //             context: {
        //                 receiver: subs.name,
        //                 jobs: jobs,
        //             },
        //         });
        //     }
        // }
        // return {
        //     result: 'Email sent successfully',
        // };
    }
}
