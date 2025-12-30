import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from '../../database/repositories/user.repository';
import { uploadToS3, deleteFromS3 } from '../../utils/s3.util';
import { NotFoundError } from '../../common/errors/app.error';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async uploadProfilePicture(
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<{ profilePicture: string }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Delete old picture if exists
    if (user.profilePicture) {
      const oldKey = user.profilePicture.split('/').slice(-2).join('/');
      await deleteFromS3(oldKey);
    }

    // Upload new picture
    const key = `profile/${Date.now()}-${file.originalname}`;
    const s3Url = await uploadToS3(file.buffer, key, file.mimetype);

    // Update user
    user.profilePicture = s3Url;
    await user.save();

    return { profilePicture: s3Url };
  }
}
