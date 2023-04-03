import { getReqRes } from '@common/utils/get-req-res.util';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessToken = createParamDecorator(
    (data: unknown, context: ExecutionContext): string => {
        const { req } = getReqRes(context);
        return req.headers.authorization as string;
    },
);
