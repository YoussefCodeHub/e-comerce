import { IsMongoId, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsMongoId({ message: 'productId must be a valid MongoDB id' })
  productId: string;

  @Type(() => Number)
  @IsInt({ message: 'quantity must be an integer number' })
  @Min(1, { message: 'quantity must not be less than 1' })
  quantity: number;
}

export class UpdateCartItemDto {
  @IsMongoId({ message: 'productId must be a valid MongoDB id' })
  productId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'quantity must be an integer number' })
  @Min(0, { message: 'quantity must not be less than 0' })
  quantity?: number;
}
