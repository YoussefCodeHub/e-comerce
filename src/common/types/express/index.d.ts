import type { JwtPayload } from 'jsonwebtoken';
import type { HydratedDocument } from 'mongoose';
import type { IUser } from '../models/User.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: HydratedDocument<IUser>['_id'];
      decodedId: JwtPayload;
    };
  }
}
