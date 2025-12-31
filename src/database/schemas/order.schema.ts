import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

// Enums
export enum OrderStatusEnum {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethodEnum {
  CASH = 'cash',
  CARD = 'card',
}

// Interfaces
export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  status: OrderStatusEnum;
  paymentMethod: PaymentMethodEnum;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  shippingAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;

// Sub Schema (OrderItem)
@Schema({ _id: false })
export class OrderItem implements IOrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// Main Schema (Order)
@Schema({ timestamps: true })
export class Order implements IOrder {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true, default: [] })
  items: OrderItem[];

  @Prop({ required: true, default: 0, min: 0 })
  totalPrice: number;

  @Prop({ default: 0, min: 0 })
  discount: number;

  @Prop({ required: true, default: 0, min: 0 })
  finalPrice: number;

  @Prop({
    type: String,
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
    required: true,
  })
  status: OrderStatusEnum;

  @Prop({
    type: String,
    enum: PaymentMethodEnum,
    default: PaymentMethodEnum.CARD,
    required: true,
  })
  paymentMethod: PaymentMethodEnum;

  @Prop()
  stripeSessionId?: string;

  @Prop()
  stripePaymentIntentId?: string;

  @Prop({ required: true })
  shippingAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes
OrderSchema.index({ user: 1 });
OrderSchema.index({ 'items.product': 1 });
OrderSchema.index({ status: 1 });
