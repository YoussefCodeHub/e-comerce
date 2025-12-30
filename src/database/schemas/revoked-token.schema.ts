import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export interface IRevokedToken {
  jti: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}

export type RevokedTokenDocument = HydratedDocument<IRevokedToken>;

@Schema({ timestamps: true })
export class RevokedToken implements IRevokedToken {
  @Prop({ required: true })
  jti: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  expiresAt: Date;
}

export const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken);
