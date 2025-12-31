import { IsString, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCouponDto {
  @IsString()
  code: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  discount: number;

  @IsDateString()
  expiresAt: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxUses: number;
}

export class ApplyCouponDto {
  @IsString()
  code: string;
}
