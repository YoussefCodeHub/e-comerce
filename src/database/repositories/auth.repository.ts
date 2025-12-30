import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseRepository } from '../../database/repositories/database.repository';
import { User } from '../../database/schemas/user.schema';

@Injectable()
export class AuthRepository extends DatabaseRepository<User> {
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email });
  }

  async register(data: Partial<User>): Promise<User> {
    return await this.create(data);
  }
}
