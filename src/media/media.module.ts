import { forwardRef, Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Article } from '../article/entities/article.entity';
import { ArticleModule } from '../article/article.module';
import { CloudinaryService } from './CloudinaryService';

@Module({
  imports: [TypeOrmModule.forFeature([Media, Article]), forwardRef(() => ArticleModule)],
  controllers: [MediaController],
  providers: [MediaService, CloudinaryService],
  exports: [MediaService, CloudinaryService],
})
export class MediaModule {}
