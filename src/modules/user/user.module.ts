import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '../../database/repositories/user.repository';
import { User, UserSchema } from '../../database/schemas/user.schema';
import {
  RevokedToken,
  RevokedTokenSchema,
} from '../../database/schemas/revoked-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RevokedToken.name, schema: RevokedTokenSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
