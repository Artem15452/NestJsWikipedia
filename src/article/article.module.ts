import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ArticleHistoryModule } from '../article-history/article-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User]), ArticleHistoryModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
