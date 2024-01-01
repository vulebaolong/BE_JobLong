import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { TAG_MODULE_HEALTH } from '../../common/contants/swagger.contants';
import { ApiHealthCheck } from './health.swagger';

@ApiTags(TAG_MODULE_HEALTH)
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: MongooseHealthIndicator,
    ) {}

    @Get()
    @ApiHealthCheck()
    healthCheck() {
        return this.health.check([() => this.db.pingCheck('database')]);
    }
}
