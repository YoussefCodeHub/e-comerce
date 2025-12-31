import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

// Interfaces
export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  coupon?: Types.ObjectId;
  discount: number;
  finalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CartDocument = HydratedDocument<ICart>;

// Sub Schema (CartItem)
@Schema({ _id: false })
export class CartItem implements ICartItem {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Types.ObjectId;

  @Prop({
    required: true,
    min: 1,
  })
  quantity: number;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// Main Schema (Cart)
@Schema({ timestamps: true })
export class Cart implements ICart {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: [CartItemSchema],
    default: [],
  })
  items: CartItem[];

  @Prop({
    required: true,
    default: 0,
    min: 0,
  })
  totalPrice: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Coupon',
  })
  coupon?: Types.ObjectId;

  @Prop({
    default: 0,
    min: 0,
  })
  discount: number;

  @Prop({
    required: true,
    default: 0,
    min: 0,
  })
  finalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// indexes
CartSchema.index({ user: 1 });
CartSchema.index({ 'items.product': 1 });
