import { ALIAS } from '@common/enums/alias.enum';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category.model';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ALIAS.CATEGORY, schema: CategorySchema },
        ]),
    ],
    providers: [CategoryService, CategoryResolver],
})
export class CategoryModule {}
