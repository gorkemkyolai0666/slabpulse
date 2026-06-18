import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(firmId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      firm,
      totalProjects,
      activeProjects,
      cancelledProjects,
      totalSlabs,
      approvedSurveys,
      pendingRevisions,
      pendingCncTasks,
      seasonalFinishes,
      slabArea,
      recentSurveys,
      machines,
    ] = await Promise.all([
      this.prisma.firm.findUnique({ where: { id: firmId } }),
      this.prisma.stoneProject.count({ where: { firmId } }),
      this.prisma.stoneProject.count({
        where: {
          firmId,
          status: { in: ['templating', 'cutting', 'polishing', 'edge_work', 'installation'] },
        },
      }),
      this.prisma.stoneProject.count({ where: { firmId, status: 'cancelled' } }),
      this.prisma.slabInventory.count({
        where: { firmId, status: { in: ['in_stock', 'reserved', 'low'] } },
      }),
      this.prisma.siteSurvey.count({ where: { firmId, status: 'approved' } }),
      this.prisma.siteSurvey.count({
        where: {
          firmId,
          status: 'revision',
          surveyedAt: { lte: thirtyDaysLater },
        },
      }),
      this.prisma.cncTask.count({
        where: {
          firmId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.finishCatalog.count({
        where: {
          firmId,
          status: { in: ['seasonal', 'discontinued'] },
        },
      }),
      this.prisma.slabInventory.aggregate({
        where: { firmId, status: { in: ['in_stock', 'reserved', 'low', 'out_of_stock'] } },
        _sum: { quantitySqm: true },
      }),
      this.prisma.siteSurvey.findMany({
        where: { firmId },
        include: {
          project: { select: { projectNumber: true, clientName: true } },
        },
        orderBy: { surveyedAt: 'desc' },
        take: 5,
      }),
      this.prisma.stoneProject.groupBy({
        by: ['machineName'],
        where: { firmId, machineName: { not: null } },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = firm?.totalMachines || totalProjects || 1;
    const projectThroughputRate =
      totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 1000) / 10 : 0;

    const monthlyTrend = await this.getMonthlyTrend(firmId, sixMonthsAgo);

    return {
      totalProjects,
      activeProjects,
      cancelledProjects,
      totalCapacity,
      projectThroughputRate,
      totalSlabs,
      approvedSurveys,
      pendingRevisions,
      pendingCncTasks,
      seasonalFinishes,
      slabArea: slabArea._sum.quantitySqm || 0,
      recentSurveys,
      machines: machines.map((m) => ({
        machineName: m.machineName,
        projectCount: m._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(firmId: string, since: Date) {
    const surveys = await this.prisma.siteSurvey.findMany({
      where: { firmId, surveyedAt: { gte: since } },
      select: { surveyedAt: true, status: true, revisionNotes: true },
    });

    const months: Record<string, { siteSurveys: number; revisions: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { siteSurveys: 0, revisions: 0 };
    }

    surveys.forEach((survey) => {
      const key = `${survey.surveyedAt.getFullYear()}-${String(survey.surveyedAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].siteSurveys++;
        if (survey.status === 'revision') months[key].revisions++;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
