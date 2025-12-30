import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from '../../database/repositories/auth.repository';
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
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthRepository],
})
export class AuthModule {}
