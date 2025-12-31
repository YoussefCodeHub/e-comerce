import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from '../../database/repositories/product.repository';
import { Product, ProductSchema } from '../../database/schemas/product.schema';
import {
  Category,
  CategorySchema,
} from '../../database/schemas/category.schema';
import { Brand, BrandSchema } from '../../database/schemas/brand.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import {
  RevokedToken,
  RevokedTokenSchema,
} from '../../database/schemas/revoked-token.schema';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Brand.name, schema: BrandSchema },
      { name: User.name, schema: UserSchema },
      { name: RevokedToken.name, schema: RevokedTokenSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
