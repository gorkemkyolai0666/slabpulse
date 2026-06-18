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
import { CncTasksService } from './cnc-tasks.service';
import { CreateCncTaskDto, UpdateCncTaskDto } from './dto/cnc-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cnc-tasks')
@UseGuards(JwtAuthGuard)
export class CncTasksController {
  constructor(private cncTasksService: CncTasksService) {}

  @Get()
  list(
    @Request() req: { user: { firmId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.cncTasksService.list(req.user.firmId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.cncTasksService.get(req.user.firmId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { firmId: string } },
    @Body() dto: CreateCncTaskDto,
  ) {
    return this.cncTasksService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { firmId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateCncTaskDto,
  ) {
    return this.cncTasksService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.cncTasksService.remove(req.user.firmId, id);
  }
}
