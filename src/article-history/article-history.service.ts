import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleHistory } from './entities/article-history.entity';
import { CreateArticleHistoryDto } from './dto/create-article-history.dto';

@Injectable()
export class ArticleHistoryService {
  constructor(
    @InjectRepository(ArticleHistory)
    private readonly articleHistoryRepository: Repository<ArticleHistory>,
  ) {}

  async create(dto: CreateArticleHistoryDto): Promise<ArticleHistory> {
    const historyEntry = this.articleHistoryRepository.create({
      article: { id: dto.articleId },
      redactedBy: { id: dto.userId },
      contentBefore: dto.contentBefore,
      contentAfter: dto.contentAfter,
      titleBefore: dto.titleBefore,
      titleAfter: dto.titleAfter,
    });

    return await this.articleHistoryRepository.save(historyEntry);
  }

  async findAllByArticle(articleId: number): Promise<ArticleHistory[]> {
    return await this.articleHistoryRepository.find({
      where: { article: { id: articleId } },
      relations: ['redactedBy', 'redactedBy.avatar'],
      order: { dataRedaction: 'DESC' },
    });
  }

  async findOneByArticle(articleId: number, id: number): Promise<ArticleHistory> {
    const history = await this.articleHistoryRepository.findOne({
      where: { id, article: { id: articleId } },
      relations: ['article', 'redactedBy', 'redactedBy.avatar'],
    });

    if (!history) throw new NotFoundException('Запис історії не знайдено');
    return history;
  }

  async findOne(id: number): Promise<ArticleHistory> {
    const history = await this.articleHistoryRepository.findOne({
      where: { id },
      relations: ['article', 'redactedBy', 'redactedBy.avatar'],
    });

    if (!history) throw new NotFoundException('Запис історії не знайдено');
    return history;
  }

  async remove(id: number): Promise<void> {
    const history = await this.findOne(id);
    await this.articleHistoryRepository.remove(history);
  }
}
