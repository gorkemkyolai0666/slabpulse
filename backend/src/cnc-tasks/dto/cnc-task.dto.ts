import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { CncOperation, CncTaskStatus } from '@prisma/client';

export class CreateCncTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CncOperation)
  operation?: CncOperation;

  @IsOptional()
  @IsString()
  machineName?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(CncTaskStatus)
  status?: CncTaskStatus;
}

export class UpdateCncTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CncOperation)
  operation?: CncOperation;

  @IsOptional()
  @IsString()
  machineName?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(CncTaskStatus)
  status?: CncTaskStatus;
}
