import { Controller, Post, Body, Query, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  RefreshTokenDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const result = await this.authService.register(data);
    return {
      status: 'success',
      message: result.message,
      data: { verifyLink: result.verifyLink },
    };
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    const result = await this.authService.login(data);
    return {
      status: 'success',
      message: 'Login successful',
      data: result,
    };
  }

  @Get('confirm-email')
  async verifyEmail(@Query('token') token: string) {
    const result = await this.authService.verifyEmail(token);
    return {
      status: 'success',
      message: result.message,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDto) {
    const result = await this.authService.refreshAccessToken(data.refreshToken);
    return {
      status: 'success',
      message: 'Token refreshed successfully',
      data: result,
    };
  }

  @Post('logout')
  async logout(@Headers('authorization') authorization: string) {
    const token = authorization?.split(' ')[1];
    const result = await this.authService.logout(token);
    return {
      status: 'success',
      message: result.message,
    };
  }
}
