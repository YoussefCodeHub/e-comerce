import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover' as any,
    });
  }

  async createCheckoutSession(amount: number, orderId: string, metadata?: any) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Order Payment' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/order/cancel`,
      metadata: { orderId, ...metadata },
    });
  }

  async createPaymentIntent(amount: number, metadata?: any) {
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata,
    });
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    return await this.stripe.paymentIntents.confirm(paymentIntentId);
  }

  async refund(paymentIntentId: string, amount?: number) {
    return await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });
  }

  async getCheckoutSession(sessionId: string) {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }
}
