import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { StripeService } from './stripe.service';
import { NotFoundError, ValidationError } from '../../common/errors/app.error';
import { CartRepository } from '../../database/repositories/cart.repository';
import { OrderRepository } from '../../database/repositories/order.repository';
import { OrderStatusEnum } from '../../database/schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private stripeService: StripeService,
  ) {}

  async createOrder(
    userId: Types.ObjectId,
    shippingAddress: string,
    paymentMethod: 'cash' | 'card',
  ) {
    const cart = await this.cartRepository.findByUserWithProducts(userId);
    if (!cart || cart.items.length === 0)
      throw new ValidationError('Cart is empty');

    const order = await this.orderRepository.createOrderFromCart(
      userId,
      cart,
      paymentMethod,
      shippingAddress,
    );

    if (paymentMethod === 'card') {
      const session = await this.stripeService.createCheckoutSession(
        cart.finalPrice,
        order._id.toString(),
        { userId: userId.toString() },
      );
      order.stripeSessionId = session.id;
      await order.save();

      return { order, checkoutUrl: session.url };
    }
    await this.cartRepository.clear(userId);
    return { order };
  }

  async confirmPayment(sessionId: string) {
    const order = await this.orderRepository.findByStripeSession(sessionId);
    if (!order) throw new NotFoundError('Order not found');

    if (order.status === OrderStatusEnum.PAID) return order;

    const session = await this.stripeService.getCheckoutSession(sessionId);

    if (session.payment_status !== 'paid')
      throw new ValidationError('Payment not completed');

    order.status = OrderStatusEnum.PAID;
    order.stripePaymentIntentId = session.payment_intent as string;
    await order.save();

    await this.cartRepository.clear(order.user);

    return order;
  }

  async refundOrder(orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.status !== 'paid') throw new ValidationError('Order not paid');

    if (order.stripePaymentIntentId)
      await this.stripeService.refund(order.stripePaymentIntentId);

    order.status = OrderStatusEnum.CANCELLED;

    await order.save();
    return order;
  }

  async getOrders(userId: Types.ObjectId) {
    return await this.orderRepository.findByUser(userId);
  }
}
