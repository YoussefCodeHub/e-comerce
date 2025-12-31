import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

// Interface
export interface ICategory {
  name: string;
  slug: string;
  slogan: string;
  description?: string;
  image: string;
  freezedAt?: Date;
  restoredAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export type CategoryDocument = HydratedDocument<ICategory>;

// Schema Class
@Schema({ timestamps: true })
export class Category implements ICategory {
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
    trim: true,
    minlength: 2,
    maxlength: 255,
  })
  description?: string;

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

export const CategorySchema = SchemaFactory.createForClass(Category);

// Indexes
CategorySchema.index({ name: 1 });
CategorySchema.index({ slug: 1 });
