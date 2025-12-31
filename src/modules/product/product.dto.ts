import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsMongoId,
  IsNumber,
  IsInt,
  Min,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AtLeastOne } from '../../common/validators/at-least-one.validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsMongoId()
  category: string;

  @IsMongoId()
  brand: string;
}

export class UpdateProductDto {
  @AtLeastOne(
    [
      'name',
      'description',
      'price',
      'stock',
      'image',
      'category',
      'brand',
      'slug',
    ],
    {
      message: 'You must provide at least one field to update',
    },
  )
  _atLeastOne?: any;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
