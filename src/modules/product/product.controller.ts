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
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Types } from 'mongoose';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() data: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const product = await this.productService.create(data, file, req.user._id);
    return { status: 'success', message: 'Product created', data: product };
  }

  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    return { status: 'success', data: products };
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    const product = await this.productService.findOne(id);
    return { status: 'success', data: product };
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  async toggleFavorite(@Param('id') id: Types.ObjectId, @Req() req: any) {
    const result = await this.productService.toggleFavorite(id, req.user._id);
    return { status: 'success', data: result };
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() data: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const product = await this.productService.update(
      id,
      data,
      file,
      req.user._id,
    );
    return { status: 'success', message: 'Product updated', data: product };
  }
}
