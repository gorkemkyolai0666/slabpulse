import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    firm: { findUnique: jest.fn() },
    stoneProject: { count: jest.fn(), groupBy: jest.fn() },
    slabInventory: { count: jest.fn(), aggregate: jest.fn() },
    siteSurvey: {
      count: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    cncTask: { count: jest.fn() },
    finishCatalog: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return dashboard stats', async () => {
    mockPrisma.firm.findUnique.mockResolvedValue({ totalMachines: 4 });
    mockPrisma.stoneProject.count.mockResolvedValue(10);
    mockPrisma.slabInventory.count.mockResolvedValue(8);
    mockPrisma.siteSurvey.count.mockResolvedValue(5);
    mockPrisma.slabInventory.aggregate.mockResolvedValue({ _sum: { quantitySqm: 220.5 } });
    mockPrisma.siteSurvey.findMany.mockResolvedValue([]);
    mockPrisma.cncTask.count.mockResolvedValue(2);
    mockPrisma.finishCatalog.count.mockResolvedValue(1);
    mockPrisma.stoneProject.groupBy.mockResolvedValue([
      { machineName: 'CNC-1', _count: { id: 5 } },
    ]);

    const stats = await service.getStats('firm-1');

    expect(stats).toHaveProperty('projectThroughputRate');
    expect(stats).toHaveProperty('slabArea', 220.5);
    expect(stats).toHaveProperty('machines');
    expect(stats).toHaveProperty('pendingRevisions');
    expect(stats).toHaveProperty('pendingCncTasks');
    expect(stats).toHaveProperty('seasonalFinishes');
  });
});
