import { ERR_MSG } from '@common/constants/err-msg.constant';
import { AnyValue } from '@common/types/any-value.type';
import { BadRequestException } from '@nestjs/common';

export function validateEmptyObj(obj: Record<string, AnyValue>) {
    const propNames = Object.getOwnPropertyNames(obj);
    if (propNames.length === 0) {
        throw new BadRequestException(ERR_MSG.EMPTY(`${obj.constructor.name}`));
    }
}
