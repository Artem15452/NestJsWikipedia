import { PartialType } from '@nestjs/swagger';
import { CreateArticleHistoryDto } from './create-article-history.dto';

export class UpdateArticleHistoryDto extends PartialType(CreateArticleHistoryDto) {}
