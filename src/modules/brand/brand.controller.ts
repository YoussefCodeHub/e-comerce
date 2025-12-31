import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './brand.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Types } from 'mongoose';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() data: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const result = await this.brandService.create(data, file, req.user._id);
    return { status: 'success', message: 'Brand created', data: result };
  }

  @Get()
  async findAll() {
    const result = await this.brandService.findAll();
    return { status: 'success', data: result };
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    const result = await this.brandService.findOne(id);
    return { status: 'success', data: result };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() data: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const result = await this.brandService.update(id, data, file, req.user._id);
    return { status: 'success', message: 'Brand updated', data: result };
  }
}
