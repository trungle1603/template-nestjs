import { AnyObj } from '@common/types/any-obj.type';
import { BadRequestException } from '@nestjs/common';
import { validateOrReject } from 'class-validator';

export async function validate<T extends AnyObj>(
    classValidate: T,
    obj: AnyObj,
): Promise<void> {
    try {
        await validateOrReject(Object.assign(classValidate, obj), {
            stopAtFirstError: true,
        });
    } catch (errors) {
        const errMsg = Object.values(errors[0].constraints)[0];
        throw new BadRequestException(errMsg);
    }
}
