import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { FirmModule } from './firm/firm.module';
import { ProjectsModule } from './projects/projects.module';
import { SlabsModule } from './slabs/slabs.module';
import { SurveysModule } from './surveys/surveys.module';
import { CncTasksModule } from './cnc-tasks/cnc-tasks.module';
import { FinishesModule } from './finishes/finishes.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    FirmModule,
    ProjectsModule,
    SlabsModule,
    SurveysModule,
    CncTasksModule,
    FinishesModule,
    DashboardModule,
  ],
})
export class AppModule {}
