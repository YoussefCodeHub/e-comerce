import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

// Interfaces
export interface ICoupon {
  code: string;
  discount: number;
  expiresAt: Date;
  maxUses: number;
  usedCount: number;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CouponDocument = HydratedDocument<ICoupon>;

// Main Schema
@Schema({ timestamps: true })
export class Coupon implements ICoupon {
  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  code: string;

  @Prop({
    required: true,
    min: 0,
    max: 100,
  })
  discount: number;

  @Prop({
    required: true,
  })
  expiresAt: Date;

  @Prop({
    required: true,
    min: 1,
  })
  maxUses: number;

  @Prop({
    default: 0,
    min: 0,
  })
  usedCount: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  createdBy?: Types.ObjectId;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

// Indexes
CouponSchema.index({ code: 1 });
CouponSchema.index({ createdBy: 1 });
