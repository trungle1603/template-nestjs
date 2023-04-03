import { getReqRes } from '@common/utils/get-req-res.util';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext) {
        return getReqRes(context);
    }
}

// const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
