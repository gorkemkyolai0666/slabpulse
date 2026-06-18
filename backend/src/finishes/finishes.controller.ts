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
import { FinishesService } from './finishes.service';
import { CreateFinishDto, UpdateFinishDto } from './dto/finish.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('finishes')
@UseGuards(JwtAuthGuard)
export class FinishesController {
  constructor(private finishesService: FinishesService) {}

  @Get()
  list(
    @Request() req: { user: { firmId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.finishesService.list(req.user.firmId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.finishesService.get(req.user.firmId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { firmId: string } },
    @Body() dto: CreateFinishDto,
  ) {
    return this.finishesService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { firmId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateFinishDto,
  ) {
    return this.finishesService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.finishesService.remove(req.user.firmId, id);
  }
}
