import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
      fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
          return cb(
            new Error('Invalid file type. Only JPG and PNG allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadProfilePicture(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.userService.uploadProfilePicture(
      req.user._id,
      file,
    );
    return {
      status: 'success',
      message: 'Profile picture uploaded successfully',
      data: result,
    };
  }
}
