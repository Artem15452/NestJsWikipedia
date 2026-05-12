import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CountArticlesDto } from './dto/count-articles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { Repository, Like, ILike, Not } from 'typeorm';
import slugify from 'slugify';
import { ArticleCategory } from './enums/category.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ArticleHistoryService } from '../article-history/article-history.service';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly historyService: ArticleHistoryService,
  ) {}

  private buildArticleSnapshot(article: Article) {
    return {
      title: article.title,
      content: article.content,
      categories: article.categories,
      sections: article.sections,
      references: article.references,
      isApproved: article.isApproved,
      slug: article.slug,
      date: article.date,
    };
  }

  private sortArticleHistoryByNewest(articles: Article[]) {
    for (const article of articles) {
      article.history?.sort(
        (a, b) => new Date(b.dataRedaction).getTime() - new Date(a.dataRedaction).getTime(),
      );
    }
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const { authorId, ...articleData } = createArticleDto;
    const user = await this.userRepository.findOneBy({ id: authorId });
    if (!user) throw new NotFoundException('Користувача не знайдено');

    const ifArticleExist = await this.articleRepository.findOneBy({ title: articleData.title });
    if (ifArticleExist) throw new BadRequestException('Стаття з такою назвою вже існує');

    const article = this.articleRepository.create(articleData);
    const baseSlug = slugify(article.title, { lower: true, strict: true });
    article.slug = `${baseSlug}-${Date.now()}`;
    article.contributors = [user];

    await this.articleRepository.save(article);
    return await this.findOneEntityBySlug(article.slug);
  }

  async findOneEntityBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: [
        'contributors',
        'contributors.avatar',
        'history',
        'history.redactedBy',
        'history.redactedBy.avatar',
      ],
    });
    if (!article) throw new NotFoundException(`Статтю зі слагом ${slug} не знайдено`);
    return article;
  }

  async findOneWithRelated(slug: string): Promise<{ article: Article; related: Article[] }> {
    const article = await this.findOneEntityBySlug(slug);

    const primaryCategory = article.categories?.length > 0 ? article.categories[0] : null;
    let related: Article[] = [];

    if (primaryCategory) {
      related = await this.articleRepository.find({
        where: {
          categories: Like(`%${primaryCategory}%`),
          id: Not(article.id),
        },
        take: 4,
        relations: [
          'contributors',
          'contributors.avatar',
          'history',
          'history.redactedBy',
          'history.redactedBy.avatar',
        ],
        order: { date: 'DESC' },
      });
    }

    this.sortArticleHistoryByNewest([article]);
    this.sortArticleHistoryByNewest(related);

    return { article, related };
  }

  async update(slug: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOneEntityBySlug(slug);
    const previousSnapshot = this.buildArticleSnapshot(article);
    const { editorId, ...articleData } = updateArticleDto;

    if (articleData.title && articleData.title !== article.title) {
      const baseSlug = slugify(articleData.title, { lower: true, strict: true });
      article.slug = `${baseSlug}-${Date.now()}`;
    }

    if (editorId) {
      const editor = await this.userRepository.findOneBy({ id: editorId });
      if (editor) {
        const isAlreadyContributor = article.contributors.some((c) => c.id === editor.id);
        if (!isAlreadyContributor) {
          article.contributors.push(editor);
        }
      }
    }

    this.articleRepository.merge(article, articleData);
    const savedArticle = await this.articleRepository.save(article);

    if (editorId) {
      try {
        await this.historyService.create({
          articleId: savedArticle.id,
          userId: editorId,
          contentBefore: previousSnapshot,
          contentAfter: this.buildArticleSnapshot(savedArticle),
          titleBefore: previousSnapshot.title,
          titleAfter: savedArticle.title,
        });
      } catch (error) {
        console.error('Не вдалося зберегти історію редагування:', error);
      }
    }

    return await this.findOneEntityBySlug(savedArticle.slug);
  }

  async findAll(
    paginationDto: PaginationDto,
    category?: ArticleCategory,
  ): Promise<PaginatedResponseDto<Article>> {
    const page = Number(paginationDto.page) || 1;
    const limit = Number(paginationDto.limit) || 10;
    const skip = (page - 1) * limit;

    const whereCondition = category ? { categories: ILike(`%${category}%`) } : {};

    const [articles, total] = await this.articleRepository.findAndCount({
      where: whereCondition,
      relations: [
        'contributors',
        'contributors.avatar',
        'history',
        'history.redactedBy',
        'history.redactedBy.avatar',
      ],
      order: { id: 'DESC' },
      take: limit,
      skip: skip,
    });

    this.sortArticleHistoryByNewest(articles);

    return new PaginatedResponseDto(articles, page, limit, total);
  }

  async searchArticles(query: string): Promise<Article[]> {
    if (!query || query.length < 2) return [];
    const articles = await this.articleRepository.find({
      where: [{ title: ILike(`%${query}%`) }],
      take: 10,
      relations: [
        'contributors',
        'contributors.avatar',
        'history',
        'history.redactedBy',
        'history.redactedBy.avatar',
      ],
    });

    this.sortArticleHistoryByNewest(articles);
    return articles;
  }

  async getOneRandomArticle(): Promise<Article> {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .orderBy('RANDOM()')
      .leftJoinAndSelect('article.contributors', 'contributor')
      .leftJoinAndSelect('contributor.avatar', 'avatar')
      .leftJoinAndSelect('article.history', 'history')
      .leftJoinAndSelect('history.redactedBy', 'historyEditor')
      .leftJoinAndSelect('historyEditor.avatar', 'historyEditorAvatar')
      .getOne();
    if (!article) throw new NotFoundException('Статей не знайдено');

    this.sortArticleHistoryByNewest([article]);
    return article;
  }

  async findHistoryBySlug(slug: string) {
    const article = await this.findOneEntityBySlug(slug);
    return await this.historyService.findAllByArticle(article.id);
  }

  async findHistoryVersionBySlug(slug: string, historyId: number) {
    const article = await this.findOneEntityBySlug(slug);
    return await this.historyService.findOneByArticle(article.id, historyId);
  }

  async remove(slug: string): Promise<void> {
    const article = await this.findOneEntityBySlug(slug);
    await this.articleRepository.remove(article);
  }

  async getCountArticles(): Promise<CountArticlesDto> {
    const categories = Object.values(ArticleCategory);
    const counts = await Promise.all(
      categories.map((cat) =>
        this.articleRepository.count({ where: { categories: Like(`%${cat}%`) } }),
      ),
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
