import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { MediaModule } from './media/media.module';
import { ArticleHistoryModule } from './article-history/article-history.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        let dbUrl = process.env.DATABASE_URL_PRIMARY;

        if (!dbUrl) {
          console.warn('⚠️ DATABASE_URL_PRIMARY не знайдено. Перемикаюся на RESERVE...');
          dbUrl =
            process.env.DATABASE_URL_RESERVE || 'postgres://postgres:5052@localhost:5432/testDb';
        }

        const needsSsl =
          dbUrl.includes('neon.tech') ||
          dbUrl.includes('onrender.com') ||
          process.env.NODE_ENV === 'production';

        console.log(`🔌 Спроба підключення до бази даних: ${dbUrl.split('@')[1] || 'localhost'}`);

        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          synchronize: true,
          ssl: needsSsl ? { rejectUnauthorized: false } : false,
          extra: dbUrl.includes('neon.tech')
            ? {
                connectionTimeoutMillis: 10000,
                statement_timeout: 10000,
              }
            : undefined,
        };
      },
    }),
    UsersModule,
    ArticleModule,
    MediaModule,
    ArticleHistoryModule,
  ],
})
export class AppModule {}
