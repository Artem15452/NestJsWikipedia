import { IsOptional, IsEnum } from 'class-validator';
import { ArticleCategory } from '../enums/category.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleQueryDto extends PaginationDto {
  @ApiProperty({ 
    enum: ArticleCategory, 
    required: false, 
    description: 'Фільтр за категорією' 
  })
  @IsOptional()
  @IsEnum(ArticleCategory)
  category?: ArticleCategory;
}
