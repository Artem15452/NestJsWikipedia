import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CountArticlesDto } from './dto/count-articles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { Repository, Like, ILike } from 'typeorm';
import slugify from 'slugify';
import { ArticleCategory } from './enums/category.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const { authorId, ...articleData } = createArticleDto;

    const user = await this.userRepository.findOneBy({ id: authorId });
    if (!user) throw new NotFoundException('Користувача (автора) не знайдено');

    const ifArticleExist = await this.articleRepository.findOneBy({ title: articleData.title });
    if (ifArticleExist) {
      throw new BadRequestException("Стаття з такою назвою вже існує");
    }

    const article = this.articleRepository.create(articleData);

    const baseSlug = slugify(article.title, { lower: true, strict: true });
    article.slug = `${baseSlug}-${Date.now()}`;

    article.contributors = [user];

    return await this.articleRepository.save(article);
  }

  async update(slug: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOneBySlug(slug);

    if (updateArticleDto.title) {
      const baseSlug = slugify(updateArticleDto.title, { lower: true, strict: true });
      article.slug = `${baseSlug}-${Date.now()}`;
    }

    this.articleRepository.merge(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async remove(slug: string): Promise<void> {
    const article = await this.findOneBySlug(slug);
    await this.articleRepository.remove(article);
  }

 async findAll(
    paginationDto: PaginationDto, 
    category?: ArticleCategory
  ): Promise<PaginatedResponseDto<Article>> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;
   
    const whereCondition = category 
      ? { categories: ILike(`%${category}%`) } 
      : {};

    const [articles, total] = await this.articleRepository.findAndCount({
      where: whereCondition,
      relations: ['contributors'],
      order: { id: 'DESC' },
      take: limit, 
      skip: skip,  
    });

    return new PaginatedResponseDto(articles, page, limit, total);
  }
  async findOneBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['contributors'],
    });

    if (!article) {
      throw new NotFoundException(`Статтю зі слагом ${slug} не знайдено`);
    }
    return article;
  }

  async getArticleByEmail(email: string, paginationDto: PaginationDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['articles'],
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 20;
    const skip = (page - 1) * limit;

    const articles = user.articles.slice(skip, skip + limit);
    const total = user.articles.length;

    return new PaginatedResponseDto(articles, page, limit, total);
  }

  async getCountArticles(): Promise<CountArticlesDto> {
    const categories = Object.values(ArticleCategory);
    const counts = await Promise.all(
      categories.map(cat => 
        this.articleRepository.count({ where: { categories: Like(`%${cat}%`) } })
      )
    );

    const total = await this.articleRepository.count();

    return {
      webDevelopment: counts[categories.indexOf(ArticleCategory.WEB)],
      mobileApps: counts[categories.indexOf(ArticleCategory.MOBILE)],
      dataScience: counts[categories.indexOf(ArticleCategory.SCIENCE)],
      uxUiDesign: counts[categories.indexOf(ArticleCategory.DESIGN)],
      cyberSecurity: counts[categories.indexOf(ArticleCategory.SECURITY)],
      devOps: counts[categories.indexOf(ArticleCategory.DEVOPS)],
      totalCount: total,
    };
  }
}
