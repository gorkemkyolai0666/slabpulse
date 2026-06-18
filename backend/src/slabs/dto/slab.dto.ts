import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { SlabStatus, SlabUnit } from '@prisma/client';

export class CreateSlabDto {
  @IsString()
  slabName: string;

  @IsOptional()
  @IsString()
  stoneType?: string;

  @IsNumber()
  @Min(0)
  quantitySqm: number;

  @IsOptional()
  @IsEnum(SlabUnit)
  slabUnit?: SlabUnit;

  @IsOptional()
  @IsEnum(SlabStatus)
  status?: SlabStatus;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSlabDto {
  @IsOptional()
  @IsString()
  slabName?: string;

  @IsOptional()
  @IsString()
  stoneType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantitySqm?: number;

  @IsOptional()
  @IsEnum(SlabUnit)
  slabUnit?: SlabUnit;

  @IsOptional()
  @IsEnum(SlabStatus)
  status?: SlabStatus;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
