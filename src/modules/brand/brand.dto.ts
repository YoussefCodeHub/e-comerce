import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  slogan: string;
}

export class UpdateBrandDto {
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  name?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(25)
  slogan?: string;
}
