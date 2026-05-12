import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateArticleHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  articleId!: number;

  @IsOptional()
  contentBefore?: any;

  @IsOptional()
  contentAfter?: any;

  @IsUUID(4)
  userId!: string;

  @IsOptional()
  titleBefore?: string;

  @IsOptional()
  titleAfter?: string;
}
