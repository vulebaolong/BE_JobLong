import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { Public, ResponseMessage } from 'src/decorator/customize';

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: MongooseHealthIndicator,
    ) {}

    @Get()
    @Public()
    @HealthCheck()
    @ApiOperation({ summary: 'Headlth check' })
    @ResponseMessage('Headlth check')
    check() {
        return this.health.check([() => this.db.pingCheck('database')]);
    }
}
