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
      replication: {
        master: {
          url: process.env.DATABASE_URL_PRIMARY || 'postgres://postgres:5052@localhost:5432/testDb',
          ssl: process.env.DATABASE_URL_PRIMARY ? { rejectUnauthorized: false } : false,
        },
        slaves: [
          {
            url:
              process.env.DATABASE_URL_RESERVE ||
              'postgres://postgres:5052@localhost:5432/testDb_replica',
            ssl: process.env.DATABASE_URL_RESERVE ? { rejectUnauthorized: false } : false,
          },
        ],
      },
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    ArticleModule,
    MediaModule,
    ArticleHistoryModule,
  ],
})
export class AppModule {}
