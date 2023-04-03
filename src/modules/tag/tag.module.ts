import { ALIAS } from '@common/enums/alias.enum';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './tag.model';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ALIAS.TAG, schema: TagSchema }]),
    ],
    providers: [TagService, TagResolver],
})
export class TagModule {}
