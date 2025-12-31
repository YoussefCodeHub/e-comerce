import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '../../modules/redis/redis.service';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { ProductRepository } from '../../database/repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { uploadToS3 } from '../../utils/s3.util';
import { NotFoundError } from '../../common/errors/app.error';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly redisService: RedisService,
  ) {}

  async create(
    data: CreateProductDto,
    file: Express.Multer.File,
    userId: Types.ObjectId,
  ) {
    const slug = slugify(data.name, { lower: true });

    const key = `products/${Date.now()}-${file.originalname}`;
    const imageUrl = await uploadToS3(file.buffer, key, file.mimetype);

    const product = await this.productRepo.create({
      ...data,
      slug,
      image: imageUrl,
      favorites: [],
      createdBy: userId,
    });

    await this.redisService.del('products:all');
    return product;
  }

  async findAll() {
    const cached = await this.redisService.getJSON('products:all');
    if (cached) return cached;

    const products = await this.productRepo.findAllActive();

    await this.redisService.setJSON('products:all', products, 300); // 5 min
    return products;
  }

  async findOne(id: Types.ObjectId) {
    const product = await this.productRepo.findById(id);
    if (!product || product.freezedAt)
      throw new NotFoundError('Product not found');
    return product;
  }

  async toggleFavorite(productid: Types.ObjectId, userId: Types.ObjectId) {
    const product = await this.productRepo.findById(productid);
    if (!product) throw new NotFoundError('Product not found');

    const index = product.favorites.findIndex(
      (id) => id.toString() === userId.toString(),
    );

    if (index > -1) {
      product.favorites.splice(index, 1);
    } else {
      product.favorites.push(userId);
    }

    await product.save();
    return { isFavorite: index === -1 };
  }

  async update(
    productid: Types.ObjectId,
    data: UpdateProductDto,
    file: Express.Multer.File | null,
    userId: Types.ObjectId,
  ) {
    const product = await this.productRepo.findById(productid);
    if (!product || product.freezedAt)
      throw new NotFoundError('Product not found');

    if (data.name && data.name !== product.name) {
      data.slug = slugify(data.name, { lower: true });
    }

    if (file) {
      const key = `products/${Date.now()}-${file.originalname}`;
      const imageUrl = await uploadToS3(file.buffer, key, file.mimetype);
      data.image = imageUrl;
    }

    const updatedProduct = await this.productRepo.updateProduct(product._id, {
      ...data,
      updatedBy: userId,
    });

    await this.redisService.del('products:all');
    return updatedProduct;
  }
}
