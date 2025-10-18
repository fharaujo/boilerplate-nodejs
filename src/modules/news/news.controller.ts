import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { NewsSourcesResponse } from './types/news.types';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('sources')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List news sources for BR sport from NewsAPI' })
  async getSources(): Promise<NewsSourcesResponse> {
    return this.newsService.getSources();
  }
}
