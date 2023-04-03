import { ERR_MSG } from '@common/constants/err-msg.constant';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const cookieConfig = registerAs('cookie', function () {
    const signature = process.env.COOKIE_SIGNATURE;
    if (!signature) {
        throw new InternalServerErrorException(
            ERR_MSG.MISSING('cookie signature'),
        );
    }

    return {
        signature,
        defaultOpts: {
            signed: true,
            secure: true,
            httpOnly: true,
        },
    };
});

export type CookieConfig = ConfigType<typeof cookieConfig>;
export function InjectCookieConfig() {
    return Inject(cookieConfig.KEY);
}

// Set accessToken to cookies
// const cookieOpts: CookieOptions = {
//     ...this.cookieConfig.defaultOpts,
//     expires: new Date(
//         Date.now() +
//             this.jwtConfig.accessTokenExpirationTime *
//                 MILLISECONDS.ONE_SECOND,
//     ),
// };
// res.cookie('accessToken', `bearer ${accessToken}`, cookieOpts);
