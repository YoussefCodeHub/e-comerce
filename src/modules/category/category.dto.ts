import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { AtLeastOne } from '../../common/validators/at-least-one.validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  slogan: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  description?: string;
}

export class UpdateCategoryDto {
  @AtLeastOne(['name', 'slogan', 'description'], {
    message: 'You must provide at least one field to update',
  })
  _atLeastOne?: any;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  slogan?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  description?: string;
}
