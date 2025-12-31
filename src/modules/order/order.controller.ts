import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto, RefundOrderDto, ConfirmPaymentDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createOrder(@Body() data: CreateOrderDto, @Req() req: any) {
    const result = await this.orderService.createOrder(
      req.user._id,
      data.shippingAddress,
      data.paymentMethod,
    );
    return { status: 'success', message: 'Order created', data: result };
  }

  @Post('confirm-payment')
  @UseGuards(AuthGuard)
  async confirmPayment(@Body() data: ConfirmPaymentDto) {
    const order = await this.orderService.confirmPayment(data.sessionId);
    return { status: 'success', message: 'Payment confirmed', data: order };
  }

  @Post('refund')
  @UseGuards(AuthGuard)
  async refundOrder(@Body() data: RefundOrderDto) {
    const order = await this.orderService.refundOrder(data.orderId);
    return { status: 'success', message: 'Order refunded', data: order };
  }

  @Get('success')
  async success(@Query('session_id') sessionId: string) {
    // Temporarily disabled: confirmPayment call
    // To enable, uncomment the lines below
    /*
  const order = await this.orderService.confirmPayment(sessionId);
  return {
    status: 'success',
    message: 'Payment confirmed successfully',
    order,
  };
  */
    // Placeholder response
    return {
      status: 'success',
      message: 'Payment page placeholder',
      sessionId: sessionId || null,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async getOrders(@Req() req: any) {
    const orders = await this.orderService.getOrders(req.user._id);
    return { status: 'success', data: orders };
  }
}
