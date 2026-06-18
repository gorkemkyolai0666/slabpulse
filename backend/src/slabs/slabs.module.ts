import { Module } from '@nestjs/common';
import { SlabsController } from './slabs.controller';
import { SlabsService } from './slabs.service';

@Module({
  controllers: [SlabsController],
  providers: [SlabsService],
})
export class SlabsModule {}
