import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { GenderEnum, RoleEnum } from '../../database/schemas/user.schema';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsDateString()
  birthDate: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class VerifyEmailDto {
  @IsString()
  token: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
