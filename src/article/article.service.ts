import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CountArticlesDto } from './dto/count-articles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { Repository, Like } from 'typeorm';
import slugify from 'slugify';
import { ArticleCategory } from './enums/category.enum';

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
    if (!user) throw new NotFoundException('User not found');

    const article = this.articleRepository.create(articleData);
    article.slug = slugify(article.title, { lower: true, strict: true });

    article.contributors = [user];

    return await this.articleRepository.save(article);
  }

  async update(slug: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOneBySlug(slug);

    if (updateArticleDto.title) {
      article.slug = slugify(updateArticleDto.title, {
        lower: true,
        strict: true,
      });
    }

    this.articleRepository.merge(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async remove(slug: string): Promise<void> {
    const article = await this.findOneBySlug(slug);
    await this.articleRepository.remove(article);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find({ relations: ['contributors'] });
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

  async getArticleByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['articles'],
    });
    return user ? user.articles : [];
  }

  async getCountArticles(): Promise<CountArticlesDto> {
    const [web, mobile, science, design, security, devops, total] = await Promise.all([
      this.articleRepository.count({ where: { categories: Like(`%${ArticleCategory.WEB}%`) } }),
      this.articleRepository.count({ where: { categories: Like(`%${ArticleCategory.MOBILE}%`) } }),
      this.articleRepository.count({ where: { categories: Like(`%${ArticleCategory.SCIENCE}%`) } }),
      this.articleRepository.count({ where: { categories: Like(`%${ArticleCategory.DESIGN}%`) } }),
      this.articleRepository.count({
        where: { categories: Like(`%${ArticleCategory.SECURITY}%`) },
      }),
      this.articleRepository.count({ where: { categories: Like(`%${ArticleCategory.DEVOPS}%`) } }),
      this.articleRepository.count(),
    ]);

    return {
      webDevelopment: web,
      mobileApps: mobile,
      dataScience: science,
      uxUiDesign: design,
      cyberSecurity: security,
      devOps: devops,
      totalCount: total,
    };
  }
}
