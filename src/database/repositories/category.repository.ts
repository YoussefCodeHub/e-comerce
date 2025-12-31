import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, HydratedDocument, Types } from 'mongoose';
import { DatabaseRepository } from '../../database/repositories/database.repository';
import { ICategory } from '../../database/schemas/category.schema';

@Injectable()
export class CategoryRepository extends DatabaseRepository<ICategory> {
  constructor(
    @InjectModel('Category')
    model: Model<ICategory>,
  ) {
    super(model);
  }

  findById(id: Types.ObjectId): Promise<HydratedDocument<ICategory> | null> {
    return this.model.findById(id).exec();
  }

  findBySlug(slug: string): Promise<HydratedDocument<ICategory> | null> {
    return this.model.findOne({ slug, freezedAt: null }).exec();
  }

  findAllActive(): Promise<HydratedDocument<ICategory>[]> {
    return this.model.find({ freezedAt: null }).exec();
  }
}
