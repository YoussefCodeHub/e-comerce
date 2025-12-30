import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { verifyToken } from '../../utils/token.util';
import { AuthenticationError, NotFoundError } from '../errors/app.error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    @InjectModel('RevokedToken') private revokedTokenModel: Model<any>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Unauthorized access', {
        cause: 'Missing or invalid token',
        header: 'Authorization',
        expectedFormat: 'Bearer <token>',
      });
    }

    try {
      const decoded: any = verifyToken(token);

      const isRevoked = await this.revokedTokenModel.findOne({
        jti: decoded.jti,
      });
      if (isRevoked) {
        throw new AuthenticationError('Unauthorized access', {
          cause: 'Revoked or invalid token',
        });
      }

      const user = await this.userModel.findById(decoded.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new AuthenticationError('Invalid token');
    }
  }
}
