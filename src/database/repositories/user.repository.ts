import { Injectable } from '@nestjs/common';
import type {
  Model,
  HydratedDocument,
  Types,
  Require_id,
  ApplyBasicCreateCasting,
  DeepPartial,
} from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../schemas/user.schema';

@Injectable()
export class UserRepository extends DatabaseRepository<IUser> {
  constructor(
    @InjectModel('User')
    model: Model<IUser>,
  ) {
    super(model);
  }

  findUser(id: Types.ObjectId): Promise<HydratedDocument<IUser> | null> {
    return this.model.findById(id).exec();
  }

  updateUser(
    id: Types.ObjectId,
    data: DeepPartial<ApplyBasicCreateCasting<Require_id<IUser>>>,
  ): Promise<HydratedDocument<IUser> | null> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
  }
}
