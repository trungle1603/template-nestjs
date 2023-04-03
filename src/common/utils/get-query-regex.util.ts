import { ERR_MSG } from '@common/constants/err-msg.constant';
import { AnyValue } from '@common/types/any-value.type';
import { BadRequestException } from '@nestjs/common';

function queryRegex(search: AnyValue) {
    if (typeof search !== 'string') {
        throw new BadRequestException(ERR_MSG.INVALID('search'));
    }

    return { $regex: new RegExp(search.trim(), 'i') };
}

function getLengthFilterArgs<T extends object, K extends keyof T>(
    filter: T,
    args: K[],
): number {
    let count = 0;
    for (let i = 0; i < args.length; i++) {
        if (filter[args[i]]) count++;
    }
    return count;
}

export function getQueryRegex<T extends object, K extends keyof T>(
    filter: T,
    ...args: K[]
): void {
    const lengthFilterArgs = getLengthFilterArgs(filter, args);

    // If not have any value, set value undefined
    // If delete filter[key], query will find all data. ex: find({})
    if (lengthFilterArgs < 1) {
        for (const arg of args) {
            filter[arg] = undefined as any;
        }

        // find with 1 value
    } else if (lengthFilterArgs === 1) {
        filter[args[0]] = queryRegex(filter[args[0]]) as any;

        // More 2 arguments
    } else {
        const arrQueryRegex = [];
        for (const arg of args) {
            const regex: Partial<T> = {};
            regex[arg] = queryRegex(String(filter[arg])) as any;

            arrQueryRegex.push(regex);
            delete filter[arg];
        }
        Object.assign(filter, { $or: arrQueryRegex });
    }
}

// function removeFalsyExceptArr(obj: any, arr: string[]): void {
//     const keyNotInArr = Object.keys(obj).filter((key) => !arr.includes(key));
//     for (let i = 0; i < keyNotInArr.length; i++) {
//         const key = keyNotInArr[i];
//         if (!obj[key]) delete obj[key];
//     }
// }
