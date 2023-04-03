import { AppConfig, InjectAppConfig } from '@common/config/config.app';
import {
    EncryptionConfig,
    InjectEncryptionConfig,
} from '@common/config/config.encryption';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import { ROLES_KEY } from '@common/decorators/role.decorator';
import { decrypt } from '@common/utils/encryption.util';
import { getReqRes } from '@common/utils/get-req-res.util';
import { safeCompare } from '@common/utils/safe-compare.util';
import { ROLE } from '@common/enums/role.enum';
import { RoleInterface } from '@modules/role/role.interface';
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ERR_MSG } from '@common/constants/err-msg.constant';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(
        @InjectAppConfig() private readonly appConfig: AppConfig,
        @InjectEncryptionConfig()
        private readonly encryptionConfig: EncryptionConfig,
        private readonly reflector: Reflector,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const classHandle = context.getHandler().name;
        if (classHandle === 'verifyEmail') return true;

        const req = this.verifyAPIKey(context);

        const isPublic = this.getDecorator<boolean>(context, IS_PUBLIC_KEY);
        if (isPublic) return true; // return true and not require JWT

        const isAuthenticated = await super.canActivate(context);
        if (isAuthenticated) {
            const user = req.user;
            const userRoles = user.roles as RoleInterface[];

            // ADMIN access every route
            if (userRoles.some((role) => role.name === ROLE.ADMIN)) return true;

            // Handle role
            const requiredRoles = this.getDecorator<ROLE[]>(context, ROLES_KEY);
            if (!requiredRoles) return true;
            const hasRole = () =>
                userRoles.some((role) => requiredRoles.includes(role.name));
            if (!hasRole()) return false;

            // Handle permission
            const userPermissions = userRoles.flatMap(
                (role) => role.permissions,
            );
            const requiredPermissions = classHandle;
            const hasPermission = () =>
                userPermissions.some((permission) =>
                    requiredPermissions.includes(permission),
                );
            return hasPermission();
        }

        throw new UnauthorizedException(ERR_MSG.NOT_LOGGED_IN);
    }

    getRequest(context: ExecutionContext) {
        const { req } = getReqRes(context);
        return req;
    }

    getResponse(context: ExecutionContext) {
        const { res } = getReqRes(context);
        return res;
    }

    handleRequest(err: any, user: any, info: any) {
        if (err) {
            throw new UnauthorizedException(err.message);
        } else if (info) {
            throw new UnauthorizedException(info.message);
        } else if (!user) {
            throw new UnauthorizedException(ERR_MSG.NOT_LOGGED_IN);
        }
        return user;
    }

    private verifyAPIKey(context: ExecutionContext) {
        const req = this.getRequest(context);
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || typeof apiKey !== 'string') {
            throw new UnauthorizedException(ERR_MSG.MISSING('api key'));
        }

        const decryptedText = decrypt(
            this.encryptionConfig.keyDerivation,
            apiKey,
        );
        if (!safeCompare(decryptedText, this.appConfig.apiKey)) {
            throw new UnauthorizedException(ERR_MSG.INVALID('api key'));
        }

        return req;
    }

    private getDecorator<T>(context: ExecutionContext, key: string) {
        return this.reflector.getAllAndOverride<T>(key, [
            context.getHandler(),
            context.getClass(),
        ]);
    }
}
