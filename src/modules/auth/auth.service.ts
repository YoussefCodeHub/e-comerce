import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';
import { AuthRepository } from '../../database/repositories/auth.repository';
import { RegisterDto, LoginDto } from './auth.dto';
import { RevokedToken } from '../../database/schemas/revoked-token.schema';
import { UserDocument } from '../../database/schemas/user.schema';
import { compare } from '../../utils/hash.util';
import { generateToken, verifyToken } from '../../utils/token.util';
import sendEmail from '../../utils/send-email.util';
import {
  ConflictError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from '../../common/errors/app.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    @InjectModel(RevokedToken.name)
    private revokedTokenModel: Model<RevokedToken>,
  ) {}

  async register(
    data: RegisterDto,
  ): Promise<{ message: string; verifyLink: string }> {
    const existingUser = await this.authRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered', {
        email: data.email,
      });
    }

    const newUser = await this.authRepo.register({
      ...data,
      role: data.role || 'user',
    } as any);

    const verifyEmailToken = await generateToken(
      { id: (newUser as UserDocument)._id.toString() },
      Number(process.env.JWT_CONFIRM_EMAIL_EXPIRATION) || 86400,
    );

    const verifyEmailLink = `${process.env.BASE_URL}/api/auth/confirm-email?token=${verifyEmailToken}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Ecommerce App!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyEmailLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `;

    await sendEmail({
      to: newUser.email,
      subject: 'Verify Your Email',
      html: emailHtml,
    });

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
      verifyLink: verifyEmailLink,
    };
  }

  async login(
    data: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authRepo.findByEmail(data.email);

    if (!user || !(await compare(data.password, user.password))) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (!user.confirmEmail) {
      throw new AuthorizationError(
        'Your email address is not verified. Please verify your email to continue.',
        {
          email: user.email,
        },
      );
    }

    const accessToken = await generateToken(
      { id: (user as UserDocument)._id.toString(), jti: randomUUID() },
      Number(process.env.JWT_ACCESS_EXPIRATION) || 3600,
    );

    const refreshToken = await generateToken(
      { id: (user as UserDocument)._id.toString(), jti: randomUUID() },
      Number(process.env.JWT_REFRESH_EXPIRATION) || 604800,
    );

    return { accessToken, refreshToken };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const decoded: any = verifyToken(token);
    const user = await this.authRepo.findById(decoded.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.confirmEmail = new Date();
    await user.save();

    return { message: 'Email verified successfully' };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const decoded: any = verifyToken(refreshToken);
    const user = await this.authRepo.findById(decoded.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const accessToken = await generateToken(
      { id: (user as UserDocument)._id.toString(), jti: randomUUID() },
      Number(process.env.JWT_ACCESS_EXPIRATION) || 3600,
    );

    return { accessToken };
  }

  async logout(token: string): Promise<{ message: string }> {
    const decoded: any = verifyToken(token);

    await this.revokedTokenModel.create({
      jti: decoded.jti,
      userId: decoded.id,
      expiresAt: new Date(decoded.exp * 1000),
    });

    return { message: 'Logged out successfully' };
  }
}
