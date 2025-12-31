import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

// Interface
export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  favorites: Types.ObjectId[];
  freezedAt?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export type ProductDocument = HydratedDocument<IProduct>;

// Schema Class
@Schema({ timestamps: true })
export class Product implements IProduct {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
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
  })
  description: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    required: true,
    min: 0,
  })
  stock: number;

  @Prop({
    required: true,
    trim: true,
  })
  image: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Brand',
    required: true,
  })
  brand: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  favorites: Types.ObjectId[];

  @Prop({ type: Date })
  freezedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ name: 1, category: 1, brand: 1 });
