import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsUUID(4)
  @IsOptional()
  editorId?: string;
}
