import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleHistoryService } from './article-history.service';
import { ArticleHistoryController } from './article-history.controller';
import { ArticleHistory } from './entities/article-history.entity';
import { Article } from '../article/entities/article.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleHistory, Article, User])],
  controllers: [ArticleHistoryController],
  providers: [ArticleHistoryService],
  exports: [ArticleHistoryService],
})
export class ArticleHistoryModule {}
