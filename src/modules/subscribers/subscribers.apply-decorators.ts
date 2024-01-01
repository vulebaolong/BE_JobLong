import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { CreatedResponse, OkResponse, UpdatedResponse } from '../../common/swagger/swagger';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { Subscriber } from './schemas/subscriber.schema';
import { SkipCheckPermission } from '../../common/decorators/skip-check-permission.decorator';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';

export const ApiCreateSubscriber = () => {
    const mes = 'Create a new subscriber';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        ApiBody({ type: CreateSubscriberDto }),
        CreatedResponse(mes, Subscriber),
    );
};

export const ApiGetListSubscribers = () => {
    const mes = 'Get list subscribers with pagination';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Subscriber, true),
    );
};

export const ApiGetSkillsOfSubscriber = () => {
    const mes = 'Get skills of subscriber';
    return applyDecorators(
        SkipCheckPermission(),
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, false, false, {
            _id: '656abea8b523d5c9743d1b25',
            skills: ['TYPESCRIPT', 'JAVA', 'FULLSTACK', 'REACTJS'],
        }),
    );
};

export const ApiGetSubscriber = () => {
    const mes = 'Get a subscriber by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, Subscriber, false),
    );
};

export const ApiUpdateSubscriber = () => {
    const mes = 'Update a subscriber by email';
    return applyDecorators(
        SkipCheckPermission(),
        ApiBearerAuth(),
        ApiBody({ type: UpdateSubscriberDto }),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiDeleteSubscriber = () => {
    const mes = 'Delete a subscriber by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};

export const ApiRestoreSubscriber = () => {
    const mes = 'Restore a subscriber by id';
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        UpdatedResponse(mes),
    );
};
