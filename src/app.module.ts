import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '5052',
      database: 'testDb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    ArticleModule,
    MediaModule,
  ],
})
export class AppModule {}
