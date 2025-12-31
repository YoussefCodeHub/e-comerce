import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from '../../database/repositories/cart.repository';
import { Cart, CartSchema } from '../../database/schemas/cart.schema';
import { Product, ProductSchema } from '../../database/schemas/product.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ProductModule,
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartRepository],
})
export class CartModule {}
