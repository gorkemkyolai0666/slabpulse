import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; status?: string; clientName?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.status) where.status = params.status;
    if (params.clientName) where.clientName = { contains: params.clientName, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.stoneProject.findMany({
        where,
        orderBy: [{ dueDate: 'asc' }, { projectNumber: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          siteSurveys: {
            orderBy: { surveyedAt: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.stoneProject.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const project = await this.prisma.stoneProject.findFirst({
      where: { id, firmId },
      include: {
        siteSurveys: { orderBy: { surveyedAt: 'desc' }, take: 5 },
        slabInventories: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!project) throw new NotFoundException('Stone project not found');
    return project;
  }

  async create(firmId: string, dto: CreateProjectDto) {
    return this.prisma.stoneProject.create({ data: { ...dto, firmId } });
  }

  async update(firmId: string, id: string, dto: UpdateProjectDto) {
    await this.get(firmId, id);
    return this.prisma.stoneProject.update({ where: { id }, data: dto });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.stoneProject.delete({ where: { id } });
  }
}
