import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch()
export class GlobalFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        exception = this.transformException(exception);
        const message = exception.message;
        const statusCode = exception.status;

        Logger.error(exception.message, 'GlobalFilter');
        // Handle graphql api
        const ctxType = host.getType<GqlContextType>();
        if (ctxType === 'graphql') {
            GqlArgumentsHost.create(host);
            return exception;
        }

        // Handle rest api
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response.status(statusCode).json({ message, statusCode });
    }

    transformException(exception: any): HttpException {
        const message =
            exception?.message ||
            'An error occurred while processing your request. Please reload again.';

        // Class validator error
        if (Array.isArray(exception?.response?.message)) {
            const classValidateMsg = exception.response.message.join('');

            exception = new BadRequestException(classValidateMsg);

            // Jsonwebtoken error
        } else if (exception instanceof JsonWebTokenError) {
            exception = new BadRequestException(message);

            // Mongoose schema validation error
        } else if (message.indexOf('User validation failed: ') !== -1) {
            const searchTerm = 'User validation failed: ';
            const validationErrMsg = message
                .replace(searchTerm, '')
                .replace(/:/g, '');

            exception = new BadRequestException(validationErrMsg);

            // Mongodb duplicate index error
        } else if (exception?.code === 11000) {
            exception = new BadRequestException('Duplicate');
        } else if (message.includes('ThrottlerException')) {
            exception = new BadRequestException('Too Many Requests');
        }

        exception.status =
            exception?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

        return exception;
    }
}
