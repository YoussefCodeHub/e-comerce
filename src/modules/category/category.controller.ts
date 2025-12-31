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
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Types } from 'mongoose';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() data: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const result = await this.categoryService.create(data, file, req.user._id);
    return { status: 'success', message: 'Category created', data: result };
  }

  @Get()
  async findAll() {
    const result = await this.categoryService.findAll();
    return { status: 'success', data: result };
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    const result = await this.categoryService.findOne(id);
    return { status: 'success', data: result };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() data: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const result = await this.categoryService.update(
      id,
      data,
      file,
      req.user._id,
    );
    return { status: 'success', message: 'Category updated', data: result };
  }
}
