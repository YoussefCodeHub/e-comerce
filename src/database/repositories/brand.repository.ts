import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type {
  Model,
  HydratedDocument,
  DeepPartial,
  Types,
  Require_id,
  ApplyBasicCreateCasting,
} from 'mongoose';

import { DatabaseRepository } from './database.repository';
import { IBrand } from '../schemas/brand.schema';

@Injectable()
export class BrandRepository extends DatabaseRepository<IBrand> {
  constructor(
    @InjectModel('Brand')
    model: Model<IBrand>,
  ) {
    super(model);
  }

  findById(id: Types.ObjectId): Promise<HydratedDocument<IBrand> | null> {
    return this.model.findById(id).exec();
  }

  findBySlug(slug: string): Promise<HydratedDocument<IBrand> | null> {
    return this.model.findOne({ slug, freezedAt: null }).exec();
  }

  findAllActive(): Promise<HydratedDocument<IBrand>[]> {
    return this.model.find({ freezedAt: null }).exec();
  }

  updateBrand(
    id: Types.ObjectId,
    data: DeepPartial<ApplyBasicCreateCasting<Require_id<IBrand>>>,
  ): Promise<HydratedDocument<IBrand> | null> {
    return this.model
      .findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  freeze(id: Types.ObjectId): Promise<HydratedDocument<IBrand> | null> {
    return this.model
      .findByIdAndUpdate(id, { freezedAt: new Date() }, { new: true })
      .exec();
  }

  restore(id: Types.ObjectId): Promise<HydratedDocument<IBrand> | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { freezedAt: null, restoredAt: new Date() },
        { new: true },
      )
      .exec();
  }
}
