import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto, RefundOrderDto, ConfirmPaymentDto } from './order.dto';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(@Body() data: CreateOrderDto, @Req() req: any) {
    const result = await this.orderService.createOrder(
      req.user._id,
      data.shippingAddress,
      data.paymentMethod,
    );
    return { status: 'success', message: 'Order created', data: result };
  }

  @Post('confirm-payment')
  async confirmPayment(@Body() data: ConfirmPaymentDto) {
    const order = await this.orderService.confirmPayment(data.sessionId);
    return { status: 'success', message: 'Payment confirmed', data: order };
  }

  @Post('refund')
  async refundOrder(@Body() data: RefundOrderDto) {
    const order = await this.orderService.refundOrder(data.orderId);
    return { status: 'success', message: 'Order refunded', data: order };
  }

  @Get()
  async getOrders(@Req() req: any) {
    const orders = await this.orderService.getOrders(req.user._id);
    return { status: 'success', data: orders };
  }
}
