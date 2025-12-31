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

  @IsNumber()
  @Min(0)
  price: number;

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
    ['name', 'description', 'price', 'stock', 'image', 'category', 'brand'],
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
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
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
