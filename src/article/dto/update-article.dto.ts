import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsOptional()
  @IsUUID()
  editorId?: string;
}
