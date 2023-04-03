import { ALIAS } from '@common/enums/alias.enum';
import { PermissionModule } from '@modules/permission/permission.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './role.model';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ALIAS.ROLE, schema: RoleSchema }]),
        PermissionModule,
    ],
    providers: [RoleService, RoleResolver],
    exports: [RoleService],
})
export class RoleModule {}
