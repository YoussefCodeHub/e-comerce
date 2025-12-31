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
import { Product } from '../schemas/product.schema';

@Injectable()
export class ProductRepository extends DatabaseRepository<Product> {
  constructor(
    @InjectModel(Product.name)
    model: Model<Product>,
  ) {
    super(model);
  }

  findById(id: Types.ObjectId): Promise<HydratedDocument<Product> | null> {
    return this.model.findById(id).exec();
  }

  findBySlug(slug: string): Promise<HydratedDocument<Product> | null> {
    return this.model.findOne({ slug, freezedAt: null }).exec();
  }

  findAllActive(): Promise<HydratedDocument<Product>[]> {
    return this.model.find({ freezedAt: null }).exec();
  }

  updateProduct(
    id: Types.ObjectId,
    data: DeepPartial<ApplyBasicCreateCasting<Require_id<Product>>>,
  ): Promise<HydratedDocument<Product> | null> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }

  freeze(id: Types.ObjectId): Promise<HydratedDocument<Product> | null> {
    return this.model
      .findByIdAndUpdate(id, { freezedAt: new Date() }, { new: true })
      .exec();
  }

  restore(id: Types.ObjectId): Promise<HydratedDocument<Product> | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { freezedAt: null, restoredAt: new Date() },
        { new: true },
      )
      .exec();
  }

  findByCategory(
    categoryId: Types.ObjectId,
  ): Promise<HydratedDocument<Product>[]> {
    return this.model.find({ category: categoryId, freezedAt: null }).exec();
  }

  findByBrand(brandId: Types.ObjectId): Promise<HydratedDocument<Product>[]> {
    return this.model.find({ brand: brandId, freezedAt: null }).exec();
  }
}
