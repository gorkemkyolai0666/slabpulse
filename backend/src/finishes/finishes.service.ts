import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinishDto, UpdateFinishDto } from './dto/finish.dto';

@Injectable()
export class FinishesService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.finishCatalog.findMany({
        where,
        orderBy: { title: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.finishCatalog.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const finish = await this.prisma.finishCatalog.findFirst({
      where: { id, firmId },
    });
    if (!finish) throw new NotFoundException('Finish catalog entry not found');
    return finish;
  }

  async create(firmId: string, dto: CreateFinishDto) {
    return this.prisma.finishCatalog.create({ data: { ...dto, firmId } });
  }

  async update(firmId: string, id: string, dto: UpdateFinishDto) {
    await this.get(firmId, id);
    return this.prisma.finishCatalog.update({ where: { id }, data: dto });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.finishCatalog.delete({ where: { id } });
  }
}
