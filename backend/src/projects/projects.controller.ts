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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  list(
    @Request() req: { user: { firmId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('clientName') clientName?: string,
  ) {
    return this.projectsService.list(req.user.firmId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      clientName,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.projectsService.get(req.user.firmId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { firmId: string } },
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { firmId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.projectsService.remove(req.user.firmId, id);
  }
}
