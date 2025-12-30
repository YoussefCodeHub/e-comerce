import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundFilter } from './common/filters/not-found.filter';
import { ErrorFilter } from './common/filters/errors.filter';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ErrorFilter(), new NotFoundFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application running on http://localhost:${port}`);
}
bootstrap();
