import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, HydratedDocument, Types } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Coupon } from '../schemas/coupon.schema';

@Injectable()
export class CouponRepository extends DatabaseRepository<Coupon> {
  constructor(
    @InjectModel(Coupon.name)
    model: Model<Coupon>,
  ) {
    super(model);
  }

  findByCode(code: string): Promise<HydratedDocument<Coupon> | null> {
    return this.model.findOne({ code: code.toUpperCase() }).exec();
  }

  findByCreator(
    userId: Types.ObjectId,
  ): Promise<HydratedDocument<Coupon>[] | null> {
    return this.model.find({ createdBy: userId }).exec();
  }
}
