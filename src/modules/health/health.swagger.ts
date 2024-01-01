import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

export const ApiHealthCheck = () =>
    applyDecorators(
        Public(),
        HealthCheck(),
        ApiOperation({ summary: 'Headlth check' }),
        ResponseMessage('Headlth check'),
    );
