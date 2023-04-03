import { getReqRes } from '@common/utils/get-req-res.util';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Res = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const { res } = getReqRes(context);
        return res;
    },
);

// const cryptoService = await Inject(forwardRef(() => cryptoService))(cryptoService);
