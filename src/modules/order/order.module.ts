import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from '../../database/repositories/order.repository';
import { Order, OrderSchema } from '../../database/schemas/order.schema';
import { Cart, CartSchema } from '../../database/schemas/cart.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { StripeService } from './stripe.service';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    CartModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, StripeService],
  exports: [OrderRepository],
})
export class OrderModule {}
