import { toCapitalized } from '@common/utils/string.util';

export const ERR_MSG = {
    REVOKED_TOKEN:
        'The token has been revoked. Please obtain a new token or contact the administrator for further assistance.',
    MATCH_PASSWORD: 'Passwords do not match',
    ACCOUNT_VERIFY: 'The account is not verified',
    NOT_LOGGED_IN: 'You are not logged in',

    INVALID: function (attr: string) {
        return `Invalid ${attr.toLowerCase()}`;
    },
    EXIST: function (attr: string) {
        return `${toCapitalized(attr)} already exists`;
    },
    NOT_FOUND: function (attr: string) {
        return `${toCapitalized(attr)} not found`;
    },
    MISSING: function (attr: string) {
        return `${toCapitalized(attr)} is not provided`;
    },
    REQUIRED: function (attr: string) {
        return `${toCapitalized(attr)} is required`;
    },
    EMPTY: function (attr: string) {
        return `${toCapitalized(attr)} is empty`;
    },
    EXPIRES: function (attr: string) {
        return `${toCapitalized(attr)} is expires`;
    },
};
