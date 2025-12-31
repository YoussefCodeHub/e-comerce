import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, HydratedDocument, Types } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Order } from '../schemas/order.schema';
import { ICart } from '../schemas/cart.schema';

@Injectable()
export class OrderRepository extends DatabaseRepository<Order> {
  constructor(
    @InjectModel(Order.name)
    model: Model<Order>,
  ) {
    super(model);
  }

  findByUser(
    userId: Types.ObjectId,
  ): Promise<HydratedDocument<Order>[] | null> {
    return this.model
      .find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .exec();
  }

  findByStripeSession(
    sessionId: string,
  ): Promise<HydratedDocument<Order> | null> {
    return this.model.findOne({ stripeSessionId: sessionId }).exec();
  }

  async createOrderFromCart(
    userId: Types.ObjectId,
    cart: HydratedDocument<ICart>,
    paymentMethod: 'cash' | 'card',
    shippingAddress: string,
  ) {
    return this.model.create({
      user: userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      discount: cart.discount,
      finalPrice: cart.finalPrice,
      status: 'pending',
      paymentMethod,
      shippingAddress,
    });
  }
}
