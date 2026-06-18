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
import { SurveysService } from './surveys.service';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('surveys')
@UseGuards(JwtAuthGuard)
export class SurveysController {
  constructor(private surveysService: SurveysService) {}

  @Get()
  list(
    @Request() req: { user: { firmId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.surveysService.list(req.user.firmId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get('revision')
  revision(@Request() req: { user: { firmId: string } }) {
    return this.surveysService.list(req.user.firmId, { status: 'revision' });
  }

  @Get(':id')
  get(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.surveysService.get(req.user.firmId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { firmId: string } },
    @Body() dto: CreateSurveyDto,
  ) {
    return this.surveysService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { firmId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateSurveyDto,
  ) {
    return this.surveysService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { firmId: string } }, @Param('id') id: string) {
    return this.surveysService.remove(req.user.firmId, id);
  }
}
