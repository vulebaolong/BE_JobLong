import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { OkResponse } from '../../common/swagger/swagger';

export const ApiSendMail = () => {
    const mes = 'send mail';
    return applyDecorators(
        Public(),
        ApiOperation({ summary: mes }),
        ResponseMessage(mes),
        OkResponse(mes, false, false, {
            result: 'Email sent successfully',
        }),
    );
};
