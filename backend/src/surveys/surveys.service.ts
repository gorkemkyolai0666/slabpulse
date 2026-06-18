import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';

@Injectable()
export class SurveysService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.siteSurvey.findMany({
        where,
        orderBy: { surveyedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { project: { select: { projectNumber: true, clientName: true } } },
      }),
      this.prisma.siteSurvey.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const survey = await this.prisma.siteSurvey.findFirst({
      where: { id, firmId },
      include: { project: true },
    });
    if (!survey) throw new NotFoundException('Site survey not found');
    return survey;
  }

  async create(firmId: string, dto: CreateSurveyDto) {
    return this.prisma.siteSurvey.create({
      data: {
        ...dto,
        firmId,
        surveyedAt: new Date(dto.surveyedAt),
      },
    });
  }

  async update(firmId: string, id: string, dto: UpdateSurveyDto) {
    await this.get(firmId, id);
    const { surveyedAt, ...rest } = dto;
    return this.prisma.siteSurvey.update({
      where: { id },
      data: {
        ...rest,
        ...(surveyedAt ? { surveyedAt: new Date(surveyedAt) } : {}),
      },
    });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.siteSurvey.delete({ where: { id } });
  }
}
