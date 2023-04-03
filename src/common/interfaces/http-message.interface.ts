import { Request, Response } from 'express';
import { UserPassportObjectInterface } from '../../modules/user/user.interface';

export interface RequestExpressInterface extends Request {
    user: UserPassportObjectInterface;
}
export type ResponseExpress = Response;

export interface HttpMessagesInterface {
    req: RequestExpressInterface;
    res: Response;
}
