import { Module } from '@nestjs/common';
import { PermissionResolver } from './permission.resolver';
import { PermissionService } from './permission.service';

@Module({
    providers: [PermissionService, PermissionResolver],
    exports: [PermissionService],
})
export class PermissionModule {}
