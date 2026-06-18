import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { FinishCategory, FinishStatus } from '@prisma/client';

export class CreateFinishDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(FinishCategory)
  finishCategory?: FinishCategory;

  @IsOptional()
  @IsEnum(FinishStatus)
  status?: FinishStatus;

  @IsNumber()
  @Min(0)
  pricePerSqm: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leadDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateFinishDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(FinishCategory)
  finishCategory?: FinishCategory;

  @IsOptional()
  @IsEnum(FinishStatus)
  status?: FinishStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerSqm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leadDays?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
