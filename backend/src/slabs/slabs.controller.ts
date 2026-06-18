import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { SlabsService } from './slabs.service';
import { CreateSlabDto, UpdateSlabDto } from './dto/slab.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('slabs')
@UseGuards(JwtAuthGuard)
export class SlabsController {
  constructor(private slabsService: SlabsService) {}

  @Get()
  list(
    @Request() req: { user: { firmId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.slabsService.list(req.user.firmId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.slabsService.get(req.user.firmId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { firmId: string } },
    @Body() dto: CreateSlabDto,
  ) {
    return this.slabsService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { firmId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateSlabDto,
  ) {
    return this.slabsService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.slabsService.remove(req.user.firmId, id);
  }
}
