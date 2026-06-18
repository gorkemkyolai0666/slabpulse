import { Module } from '@nestjs/common';
import { CncTasksController } from './cnc-tasks.controller';
import { CncTasksService } from './cnc-tasks.service';

@Module({
  controllers: [CncTasksController],
  providers: [CncTasksService],
})
export class CncTasksModule {}
