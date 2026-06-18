import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ProjectStatus, ProjectType } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  projectNumber: string;

  @IsString()
  clientName: string;

  @IsOptional()
  @IsEnum(ProjectType)
  projectType?: ProjectType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  areaSqm?: number;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  machineName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  projectNumber?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsEnum(ProjectType)
  projectType?: ProjectType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  areaSqm?: number;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  machineName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
