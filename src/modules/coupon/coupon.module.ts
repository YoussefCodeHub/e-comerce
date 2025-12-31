import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponRepository } from '../../database/repositories/coupon.repository';
import { Coupon, CouponSchema } from '../../database/schemas/coupon.schema';
import { Cart, CartSchema } from '../../database/schemas/cart.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    CartModule,
  ],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
  exports: [CouponRepository],
})
export class CouponModule {}
