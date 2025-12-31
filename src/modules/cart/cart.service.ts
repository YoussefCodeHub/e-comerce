import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotFoundError } from '../../common/errors/app.error';
import { CartRepository } from '../../database/repositories/cart.repository';
import { ProductRepository } from '../../database/repositories/product.repository';
import { CartDocument } from '../../database/schemas/cart.schema';
import { AddToCartDto, UpdateCartItemDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  private calculateTotal(cart: CartDocument) {
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    cart.finalPrice = cart.totalPrice - cart.discount;
  }

  async addToCart(userId: Types.ObjectId, data: AddToCartDto) {
    const { productId, quantity } = data;
    const product = await this.productRepository.findById(
      new Types.ObjectId(productId),
    );

    if (!product) throw new NotFoundError('Product not found');

    let cart = await this.cartRepository.findByUser(userId);

    if (!cart) {
      cart = await this.cartRepository.create({
        user: userId,
        items: [],
        totalPrice: 0,
        discount: 0,
        finalPrice: 0,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price: product.price,
      } as any);
    }

    this.calculateTotal(cart);
    return await cart.save();
  }

  async getCart(userId: Types.ObjectId) {
    const cart = await this.cartRepository.findByUserWithProducts(userId);
    if (!cart) throw new NotFoundError('Cart not found');
    return cart;
  }

  async updateCart(userId: Types.ObjectId, data: UpdateCartItemDto) {
    const { productId, quantity } = data;
    const cart = await this.cartRepository.findByUser(userId);
    if (!cart) throw new NotFoundError('Cart not found');

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) throw new NotFoundError('Item not in cart');

    if (quantity! <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity!;
    }

    this.calculateTotal(cart);
    return await cart.save();
  }

  async removeFromCart(userId: Types.ObjectId, productId: string) {
    const data: UpdateCartItemDto = { productId, quantity: 0 };
    return await this.updateCart(userId, data);
  }

  async clearCart(userId: Types.ObjectId) {
    const cart = await this.cartRepository.clear(userId);
    if (!cart) throw new NotFoundError('Cart not found');
    return cart;
  }
}
