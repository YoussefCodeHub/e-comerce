import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AddToCartDto, UpdateCartItemDto } from './cart.dto';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() data: AddToCartDto, @Req() req: any) {
    const cart = await this.cartService.addToCart(req.user._id, data);
    return { status: 'success', message: 'Added to cart', data: cart };
  }

  @Get()
  async getCart(@Req() req: any) {
    const cart = await this.cartService.getCart(req.user._id);
    return { status: 'success', data: cart };
  }

  @Put('update')
  async updateItem(@Body() data: UpdateCartItemDto, @Req() req: any) {
    const cart = await this.cartService.updateCart(req.user._id, data);
    return { status: 'success', message: 'Cart updated', data: cart };
  }

  @Delete('remove')
  async removeItem(@Body() data: UpdateCartItemDto, @Req() req: any) {
    const cart = await this.cartService.removeFromCart(
      req.user._id,
      data.productId,
    );
    return { status: 'success', message: 'Item removed', data: cart };
  }

  @Delete('clear')
  async clearCart(@Req() req: any) {
    const cart = await this.cartService.clearCart(req.user._id);
    return { status: 'success', message: 'Cart cleared', data: cart };
  }
}
