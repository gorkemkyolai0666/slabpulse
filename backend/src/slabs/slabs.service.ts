import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSlabDto, UpdateSlabDto } from './dto/slab.dto';

@Injectable()
export class SlabsService {
  constructor(private prisma: PrismaService) {}

  async list(firmId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { firmId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.slabInventory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { project: { select: { projectNumber: true, clientName: true } } },
      }),
      this.prisma.slabInventory.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(firmId: string, id: string) {
    const item = await this.prisma.slabInventory.findFirst({
      where: { id, firmId },
      include: { project: true },
    });
    if (!item) throw new NotFoundException('Slab inventory not found');
    return item;
  }

  async create(firmId: string, dto: CreateSlabDto) {
    return this.prisma.slabInventory.create({ data: { ...dto, firmId } });
  }

  async update(firmId: string, id: string, dto: UpdateSlabDto) {
    await this.get(firmId, id);
    return this.prisma.slabInventory.update({ where: { id }, data: dto });
  }

  async remove(firmId: string, id: string) {
    await this.get(firmId, id);
    return this.prisma.slabInventory.delete({ where: { id } });
  }
}
