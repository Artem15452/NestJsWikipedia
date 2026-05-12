import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ArticleHistoryService } from './article-history.service';
import { CreateArticleHistoryDto } from './dto/create-article-history.dto';

@Controller('article-history')
export class ArticleHistoryController {
  constructor(private readonly articleHistoryService: ArticleHistoryService) {}

  @Post()
  create(@Body() createArticleHistoryDto: CreateArticleHistoryDto) {
    return this.articleHistoryService.create(createArticleHistoryDto);
  }

  @Get('article/:articleId')
  findAllByArticle(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.articleHistoryService.findAllByArticle(articleId);
  }

  @Get('article/:articleId/:id')
  findOneByArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.articleHistoryService.findOneByArticle(articleId, id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articleHistoryService.remove(id);
  }
}
