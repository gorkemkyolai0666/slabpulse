import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const FIRM_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.firm.upsert({
    where: { id: FIRM_ID },
    update: {},
    create: {
      id: FIRM_ID,
      name: 'İstanbul Taş İşleme Ltd.',
      phone: '+905551234567',
      address: 'Organize Sanayi Bölgesi 8. Cadde No: 14',
      city: 'İstanbul',
      state: 'Marmara',
      zipCode: '34000',
      totalMachines: 4,
      timezone: 'Europe/Istanbul',
      users: {
        create: {
          email: 'demo@istanbultasatolyesi.com',
          passwordHash,
          firstName: 'Ayşe',
          lastName: 'Demir',
          role: 'owner',
        },
      },
    },
  });

  const projectData = [
    { id: '00000000-0000-0000-0000-000000000101', projectNumber: 'TS-2401', clientName: 'Villa Mermer Projesi', projectType: 'countertop' as const, areaSqm: 42, status: 'polishing' as const, machineName: 'CNC-A' },
    { id: '00000000-0000-0000-0000-000000000102', projectNumber: 'TS-2402', clientName: 'Otel Lobi Yenileme', projectType: 'flooring' as const, areaSqm: 180, status: 'cutting' as const, machineName: 'CNC-B' },
    { id: '00000000-0000-0000-0000-000000000103', projectNumber: 'TS-2403', clientName: 'Rezidans Cephe', projectType: 'facade' as const, areaSqm: 650, status: 'edge_work' as const, machineName: 'CNC-A' },
    { id: '00000000-0000-0000-0000-000000000104', projectNumber: 'TS-2404', clientName: 'Spa Banyo', projectType: 'vanity' as const, areaSqm: 28, status: 'completed' as const, machineName: 'CNC-C' },
    { id: '00000000-0000-0000-0000-000000000105', projectNumber: 'TS-2405', clientName: 'Özel Müşteri', projectType: 'stair' as const, areaSqm: 15, status: 'quoted' as const },
    { id: '00000000-0000-0000-0000-000000000106', projectNumber: 'TS-2406', clientName: 'AVM Zemin', projectType: 'flooring' as const, areaSqm: 540, status: 'templating' as const, machineName: 'CNC-B' },
  ];

  const projects = [];
  for (const p of projectData) {
    const project = await prisma.stoneProject.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, firmId: FIRM_ID, dueDate: new Date() },
    });
    projects.push(project);
  }

  const stockData = [
    { id: '00000000-0000-0000-0000-000000000201', slabName: 'Calacatta Mermer 20mm', stoneType: 'Mermer', quantitySqm: 85, slabUnit: 'slab' as const, status: 'in_stock' as const, projectId: projects[0].id },
    { id: '00000000-0000-0000-0000-000000000202', slabName: 'Absolute Black Granit', stoneType: 'Granit', quantitySqm: 42, slabUnit: 'slab' as const, status: 'low' as const, projectId: projects[1].id },
    { id: '00000000-0000-0000-0000-000000000203', slabName: 'Travertine Bej', stoneType: 'Traverten', quantitySqm: 18, slabUnit: 'remnant' as const, status: 'reserved' as const },
  ];

  for (const stock of stockData) {
    await prisma.slabInventory.upsert({
      where: { id: stock.id },
      update: {},
      create: {
        ...stock,
        firmId: FIRM_ID,
        receivedAt: new Date(),
      },
    });
  }

  const surveyedAt = new Date();
  surveyedAt.setDate(surveyedAt.getDate() - 3);

  await prisma.siteSurvey.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      firmId: FIRM_ID,
      projectId: projects[0].id,
      surveyedAt,
      surveyQuality: 'excellent',
      revisionNotes: null,
      status: 'approved',
      notes: 'Tezgah ölçüleri onaylandı — CNC kesime geçilebilir',
    },
  });

  await prisma.siteSurvey.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      firmId: FIRM_ID,
      projectId: projects[2].id,
      surveyedAt: new Date(),
      surveyQuality: 'needs_review',
      revisionNotes: 'Cephe panel boyutları revize edilecek',
      status: 'revision',
      notes: 'Mimar revizyon istedi — yeni ölçüm planlanacak',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.cncTask.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      firmId: FIRM_ID,
      title: 'CNC-A Tezgah Kesimi',
      description: 'Calacatta mermer tezgah CNC kesim ve delik işleme',
      operation: 'cutting',
      machineName: 'CNC-A',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.cncTask.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      firmId: FIRM_ID,
      title: 'CNC-B Cila İşlemi',
      description: 'Granit zemin parlatma ve honlama',
      operation: 'polishing',
      machineName: 'CNC-B',
      scheduledAt: new Date(),
      status: 'in_progress',
    },
  });

  const finishes = [
    { id: '00000000-0000-0000-0000-000000000501', title: 'Parlatılmış Yüzey', finishCategory: 'polished' as const, pricePerSqm: 285, leadDays: 3 },
    { id: '00000000-0000-0000-0000-000000000502', title: 'Honlu Mat Yüzey', finishCategory: 'honed' as const, pricePerSqm: 195, leadDays: 2 },
    { id: '00000000-0000-0000-0000-000000000503', title: 'Deri Dokulu Yüzey', finishCategory: 'leather' as const, pricePerSqm: 340, leadDays: 5, status: 'seasonal' as const },
  ];

  for (const finish of finishes) {
    await prisma.finishCatalog.upsert({
      where: { id: finish.id },
      update: {},
      create: { ...finish, firmId: FIRM_ID, status: finish.status || 'active' },
    });
  }

  console.log('SlabPulse seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
