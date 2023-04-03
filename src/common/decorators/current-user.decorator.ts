import { getReqRes } from '@common/utils/get-req-res.util';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const { req } = getReqRes(context);
        return req.user;
    },
);
