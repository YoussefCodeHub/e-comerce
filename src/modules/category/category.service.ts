import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { CategoryRepository } from '../../database/repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { uploadToS3, deleteFromS3 } from '../../utils/s3.util';
import { ConflictError, NotFoundError } from '../../common/errors/app.error';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async create(
    data: CreateCategoryDto,
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ) {
    const slug = slugify(data.name, { lower: true });

    const existing = await this.categoryRepo.findBySlug(slug);
    if (existing) throw new ConflictError('Category already exists');

    const key = `categories/${Date.now()}-${file.originalname}`;
    const imageUrl = await uploadToS3(file.buffer, key, file.mimetype);

    return await this.categoryRepo.create({
      ...data,
      slug,
      image: imageUrl,
      createdBy: userId,
    });
  }

  async findAll() {
    return await this.categoryRepo.findAllActive();
  }

  async findOne(id: Types.ObjectId) {
    const category = await this.categoryRepo.findById(id);
    if (!category || category.freezedAt)
      throw new NotFoundError('Category not found');

    return category;
  }

  async update(
    id: Types.ObjectId,
    data: UpdateCategoryDto,
    file: Express.Multer.File | undefined,
    userId: Types.ObjectId,
  ) {
    const category = await this.findOne(id);

    if (data.name) {
      category.name = data.name;
      category.slug = slugify(data.name, { lower: true });
    }

    if (data.slogan) category.slogan = data.slogan;
    if (data.description !== undefined) category.description = data.description;

    if (file) {
      const oldKey = category.image.split('/').slice(-2).join('/');
      await deleteFromS3(oldKey);

      const key = `categories/${Date.now()}-${file.originalname}`;
      category.image = await uploadToS3(file.buffer, key, file.mimetype);
    }

    category.updatedBy = userId;
    return await category.save();
  }
}
