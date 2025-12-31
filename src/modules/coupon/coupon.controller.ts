import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CreateCouponDto, ApplyCouponDto } from './coupon.dto';

@Controller('coupon')
@UseGuards(AuthGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create')
  async createCoupon(@Body() data: CreateCouponDto, @Req() req: any) {
    const coupon = await this.couponService.create(
      data.code,
      data.discount,
      new Date(data.expiresAt),
      data.maxUses,
      req.user._id,
    );
    return { status: 'success', message: 'Coupon created', data: coupon };
  }

  @Post('apply')
  async applyCoupon(@Body() data: ApplyCouponDto, @Req() req: any) {
    const cart = await this.couponService.applyCoupon(req.user._id, data.code);
    return { status: 'success', message: 'Coupon applied', data: cart };
  }
}
