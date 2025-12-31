import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

// Interface
export interface IBrand {
  name: string;
  slug: string;
  slogan: string;
  image: string;
  freezedAt?: Date;
  restoredAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export type BrandDocument = HydratedDocument<IBrand>;

// Schema Class
@Schema({ timestamps: true })
export class Brand implements IBrand {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 25,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  slug: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 25,
  })
  slogan: string;

  @Prop({
    required: true,
    trim: true,
  })
  image: string;

  @Prop({ type: Date })
  freezedAt?: Date;

  @Prop({ type: Date })
  restoredAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

// Indexes
BrandSchema.index({ name: 1 });
BrandSchema.index({ slug: 1 });
