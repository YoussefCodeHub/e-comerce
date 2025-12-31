import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from '../../database/repositories/category.repository';
import {
  Category,
  CategorySchema,
} from '../../database/schemas/category.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import {
  RevokedToken,
  RevokedTokenSchema,
} from '../../database/schemas/revoked-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema },
      { name: RevokedToken.name, schema: RevokedTokenSchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
