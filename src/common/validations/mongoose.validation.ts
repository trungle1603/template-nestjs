import { ERR_MSG } from '@common/constants/err-msg.constant';

// Match Validate
function matchValidator(val: string, regex: RegExp): boolean {
    return regex.test(val);
}

// Required Validate
type RequiredValidatorType = (val: string | number | boolean) => boolean;
function requiredValidator(val: string | number | boolean): boolean {
    if (val === undefined || val === null || val === '') {
        return false;
    }
    return true;
}

const requiredValidate: [RequiredValidatorType, string] = [
    requiredValidator,
    ERR_MSG.REQUIRED('{VALUE}'),
];

// Enum validate
function enumValidator(values: string[] | number[]) {
    return {
        values,
        message: 'value {VALUE} is not accept',
    };
}

export { matchValidator, enumValidator, requiredValidator, requiredValidate };
