import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../../common/errors/app.error';
import { CartRepository } from '../../database/repositories/cart.repository';
import { CouponRepository } from '../../database/repositories/coupon.repository';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly cartRepository: CartRepository,
  ) {}

  async create(
    code: string,
    discount: number,
    expiresAt: Date,
    maxUses: number,
    userId: Types.ObjectId,
  ) {
    const existing = await this.couponRepository.findByCode(code.toUpperCase());
    if (existing) throw new ConflictError('Coupon already exists');

    return await this.couponRepository.create({
      code: code.toUpperCase(),
      discount,
      expiresAt,
      maxUses,
      createdBy: userId,
    });
  }
  async applyCoupon(userId: Types.ObjectId, code: string) {
    const coupon = await this.couponRepository.findByCode(code.toUpperCase());
    if (!coupon) throw new NotFoundError('Coupon not found');

    if (new Date() > coupon.expiresAt)
      throw new ValidationError('Coupon expired');
    if (coupon.usedCount >= coupon.maxUses)
      throw new ValidationError('Coupon usage limit reached');

    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) throw new NotFoundError('Cart not found');

    cart.coupon = coupon._id;
    cart.discount = (cart.totalPrice * coupon.discount) / 100;
    cart.finalPrice = cart.totalPrice - cart.discount;

    return await this.cartRepository.update(cart._id, cart);
  }
}
