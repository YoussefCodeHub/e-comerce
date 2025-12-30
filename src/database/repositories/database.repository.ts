import type { DeleteOptions, UpdateOptions } from 'mongodb';
import type {
  Model,
  Types,
  HydratedDocument,
  QueryFilter,
  QueryOptions,
  ProjectionType,
  UpdateQuery,
  Require_id,
  ApplyBasicCreateCasting,
  DeepPartial,
} from 'mongoose';

export class DatabaseRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    data: DeepPartial<ApplyBasicCreateCasting<Require_id<TDocument>>>,
  ): Promise<HydratedDocument<TDocument>> {
    return this.model.create(data);
  }

  async findById(
    id: Types.ObjectId | string,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findById(id, projection, options).exec();
  }

  async findOne(
    filter?: QueryFilter<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findOne(filter, projection, options).exec();
  }

  async findAll(
    filter?: QueryFilter<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument>[]> {
    return this.model.find(filter, projection, options).exec();
  }

  async update(
    id: Types.ObjectId | string,
    update: UpdateQuery<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, ...options })
      .exec();
  }

  async updateOne(
    filter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model
      .findOneAndUpdate(filter, update, { new: true, ...options })
      .exec();
  }

  async updateMany(
    filter: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: UpdateOptions | null,
  ): Promise<{ modifiedCount: number; matchedCount: number }> {
    const result = await this.model.updateMany(filter, update, options).exec();
    return {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    };
  }

  async delete(
    id: Types.ObjectId | string,
    options?: QueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findByIdAndDelete(id, options).exec();
  }

  async deleteOne(
    filter: QueryFilter<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findOneAndDelete(filter, options).exec();
  }

  async deleteMany(
    filter: QueryFilter<TDocument>,
    options?: DeleteOptions | null,
  ): Promise<{ deletedCount: number }> {
    const result = await this.model.deleteMany(filter, options).exec();
    return { deletedCount: result.deletedCount };
  }

  async count(filter?: QueryFilter<TDocument>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: QueryFilter<TDocument>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return result !== null;
  }
}
