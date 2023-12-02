import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { TAG_MODULE_HEALTH } from 'src/common/contants/swagger.contants';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
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
