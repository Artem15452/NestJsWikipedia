import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { MediaModule } from './media/media.module';
import { ArticleHistoryModule } from './article-history/article-history.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://postgres:5052@localhost:5432/testDb',
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),
    UsersModule,
    ArticleModule,
    MediaModule,
    ArticleHistoryModule,
  ],
})
export class AppModule {}
