import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, HydratedDocument, Types } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Cart } from '../schemas/cart.schema';

@Injectable()
export class CartRepository extends DatabaseRepository<Cart> {
  constructor(
    @InjectModel(Cart.name)
    model: Model<Cart>,
  ) {
    super(model);
  }

  findByUser(userId: Types.ObjectId): Promise<HydratedDocument<Cart> | null> {
    return this.model.findOne({ user: userId }).exec();
  }

  findByUserWithProducts(
    userId: Types.ObjectId,
  ): Promise<HydratedDocument<Cart> | null> {
    return this.model
      .findOne({ user: userId })
      .populate('items.product')
      .exec();
  }

  clear(userId: Types.ObjectId) {
    return this.model.findOneAndUpdate(
      { user: userId },
      {
        items: [],
        totalPrice: 0,
        discount: 0,
        finalPrice: 0,
        coupon: null,
      },
      { new: true },
    );
  }
}
