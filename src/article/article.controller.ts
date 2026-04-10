import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Отримати всі статті' })
  async findAll(): Promise<Article[]> {
    return await this.articleService.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Отримати статистику статей за категоріями' })
  async getCount() {
    return await this.articleService.getCountArticles();
  }

  @Get('getArticlesByUserEmail/:email')
  @ApiOperation({ summary: 'Отримати статті за email автора' })
  async getArticlesByUserEmail(@Param('email') email: string) {
    return await this.articleService.getArticleByEmail(email);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Знайти статтю за її унікальним слагом' })
  async findOne(@Param('slug') slug: string): Promise<Article> {
    return await this.articleService.findOneBySlug(slug);
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
