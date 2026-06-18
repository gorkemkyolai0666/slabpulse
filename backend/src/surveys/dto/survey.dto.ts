import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SurveyQuality, SurveyStatus } from '@prisma/client';

export class CreateSurveyDto {
  @IsUUID()
  projectId: string;

  @IsDateString()
  surveyedAt: string;

  @IsOptional()
  @IsEnum(SurveyQuality)
  surveyQuality?: SurveyQuality;

  @IsOptional()
  @IsString()
  revisionNotes?: string;

  @IsOptional()
  @IsEnum(SurveyStatus)
  status?: SurveyStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSurveyDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsDateString()
  surveyedAt?: string;

  @IsOptional()
  @IsEnum(SurveyQuality)
  surveyQuality?: SurveyQuality;

  @IsOptional()
  @IsString()
  revisionNotes?: string;

  @IsOptional()
  @IsEnum(SurveyStatus)
  status?: SurveyStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
