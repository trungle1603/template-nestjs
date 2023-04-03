import { registerEnumType } from '@nestjs/graphql';

export enum ROLE {
    ADMIN,
    USER,
    GUEST,
}
registerEnumType(ROLE, { name: 'RoleEnum' });
