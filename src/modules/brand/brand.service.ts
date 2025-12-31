import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { BrandRepository } from '../../database/repositories/brand.repository';
import { CreateBrandDto, UpdateBrandDto } from './brand.dto';
import { uploadToS3, deleteFromS3 } from '../../utils/s3.util';
import { ConflictError, NotFoundError } from '../../common/errors/app.error';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepository) {}

  async create(
    data: CreateBrandDto,
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ) {
    const slug = slugify(data.name, { lower: true });

    const existing = await this.brandRepo.findBySlug(slug);
    if (existing) throw new ConflictError('Brand already exists');

    const key = `brands/${Date.now()}-${file.originalname}`;
    const imageUrl = await uploadToS3(file.buffer, key, file.mimetype);

    return await this.brandRepo.create({
      ...data,
      slug,
      image: imageUrl,
      createdBy: userId,
    });
  }

  async findAll() {
    return await this.brandRepo.findAllActive();
  }

  async findOne(id: Types.ObjectId) {
    const brand = await this.brandRepo.findById(id);
    if (!brand || brand.freezedAt) throw new NotFoundError('Brand not found');
    return brand;
  }

  async update(
    id: Types.ObjectId,
    data: UpdateBrandDto,
    file: Express.Multer.File | undefined,
    userId: Types.ObjectId,
  ) {
    const brand = await this.findOne(id);

    if (data.name) {
      brand.name = data.name;
      brand.slug = slugify(data.name, { lower: true });
    }
    if (data.slogan) brand.slogan = data.slogan;

    if (file) {
      const oldKey = brand.image.split('/').slice(-2).join('/');
      await deleteFromS3(oldKey);

      const key = `brands/${Date.now()}-${file.originalname}`;
      brand.image = await uploadToS3(file.buffer, key, file.mimetype);
    }

    brand.updatedBy = userId;
    return await brand.save();
  }
}
