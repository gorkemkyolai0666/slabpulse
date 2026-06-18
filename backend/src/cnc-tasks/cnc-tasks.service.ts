import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCncTaskDto, UpdateCncTaskDto } from './dto/cnc-task.dto';

@Injectable()
export class CncTasksService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.cncTask.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.cncTask.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const item = await this.prisma.cncTask.findFirst({
      where: { id, firmId },
    });
    if (!item) throw new NotFoundException('CNC task not found');
    return item;
  }

  async create(firmId: string, dto: CreateCncTaskDto) {
    return this.prisma.cncTask.create({
      data: {
        ...dto,
        firmId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(firmId: string, id: string, dto: UpdateCncTaskDto) {
    await this.get(firmId, id);
    const { scheduledAt, ...rest } = dto;
    return this.prisma.cncTask.update({
      where: { id },
      data: {
        ...rest,
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      },
    });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.cncTask.delete({ where: { id } });
  }
}
