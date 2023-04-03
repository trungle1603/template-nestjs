import { HttpMessagesInterface } from '@common/interfaces/http-message.interface';
import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

/**
 *
 * @param context - ExecutionContext from nest@common
 * @returns Request and Response from express
 */
export function getReqRes(context: ExecutionContext): HttpMessagesInterface {
    const ctxType = context.getType<GqlContextType>();

    if (ctxType === 'graphql') {
        const ctx = GqlExecutionContext.create(context).getContext();
        return { req: ctx.req, res: ctx.res };
    }
    const http = context.switchToHttp();
    return { req: http.getRequest(), res: http.getResponse() };
}
