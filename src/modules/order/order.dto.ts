import { IsString, IsMongoId, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  shippingAddress: string;

  @IsEnum(['cash', 'card'])
  paymentMethod: 'cash' | 'card';
}

export class RefundOrderDto {
  @IsMongoId({ message: 'orderId must be a valid MongoDB id' })
  orderId: string;
}

export class ConfirmPaymentDto {
  @IsString()
  sessionId: string;
}
