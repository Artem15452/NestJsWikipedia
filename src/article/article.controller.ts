import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ArticleCategory } from './enums/category.enum';
import { ArticleQueryDto } from './dto/article-query.dto';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({ summary: 'Створити нову статтю' })
  async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return await this.articleService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати статті з пагінацією та фільтром' })
  findAll(@Query() query: ArticleQueryDto) {
    const { category, ...paginationDto } = query;
    return this.articleService.findAll(paginationDto, category);
  }

  @Get('count')
  @ApiOperation({ summary: 'Отримати статистику статей за категоріями' })
  async getCount() {
    return await this.articleService.getCountArticles();
  }

  @Get('randArticle')
  @ApiOperation({ summary: 'Отримати випадкову статтю' })
  async getRandomArticle(): Promise<Article> {
    return await this.articleService.getOneRandomArticle();
  }

  @Get('search/live')
  @ApiOperation({ summary: 'Пошук статей за назвою (живий пошук)' })
  async liveSearch(@Query('q') query: string) {
    return this.articleService.searchArticles(query);
  }

  // Основний метод для сторінки статті (тепер повертає і статтю, і схожі)
  @Get(':slug')
  @ApiOperation({ summary: 'Знайти статтю та схожі матеріали за слагом' })
  async findOne(@Param('slug') slug: string) {
    return await this.articleService.findOneWithRelated(slug);
  }

  @Patch('update/:slug')
  @ApiOperation({ summary: 'Оновити статтю за слагом' })
  async update(
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return await this.articleService.update(slug, updateArticleDto);
  }

  @Delete('delete/:slug')
  @ApiOperation({ summary: 'Видалити статтю за слагом' })
  async remove(@Param('slug') slug: string) {
    return await this.articleService.remove(slug);
  }
}
