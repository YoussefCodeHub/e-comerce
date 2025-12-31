import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepository } from '../../database/repositories/brand.repository';
import { Brand, BrandSchema } from '../../database/schemas/brand.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import {
  RevokedToken,
  RevokedTokenSchema,
} from '../../database/schemas/revoked-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: User.name, schema: UserSchema },
      { name: RevokedToken.name, schema: RevokedTokenSchema },
    ]),
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandRepository],
})
export class BrandModule {}
