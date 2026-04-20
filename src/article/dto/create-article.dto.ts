import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsUUID, 
  ValidateNested,
} from 'class-validator';
import { ArticleCategory } from '../enums/category.enum';
import { Type } from 'class-transformer';
import { ArticleContentBlockDto } from './ArticleContentDTO';

export class CreateArticleDto {
  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'UUID автора (користувача)' 
  })
  @IsUUID(4, { message: 'authorId має бути валідним UUID v4' }) 
  authorId: string; 

  @ApiProperty({ example: 'Як побудувати NestJS додаток з нуля' })
  @IsString()
  title: string;

  @ApiProperty({
    type: [ArticleContentBlockDto],
    description: 'Масив блоків: текст, заголовки або зображення з підписами',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleContentBlockDto)
  content: ArticleContentBlockDto[];

  @ApiProperty({
    example: [ArticleCategory.WEB, ArticleCategory.SECURITY],
    enum: ArticleCategory,
    isArray: true,
    description: 'Категорії статті'
  })
  @IsArray()
  @IsEnum(ArticleCategory, { each: true })
  categories: ArticleCategory[];

  @ApiProperty({
    example: ['https://docs.nestjs.com'],
    required: false,
    isArray: true,
    description: 'Список джерел та посилань'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  references: string[];

  @ApiProperty({ 
    example: true, 
    description: 'Статус модерації статті' 
  })
  @IsBoolean()
  isApproved: boolean;
}
