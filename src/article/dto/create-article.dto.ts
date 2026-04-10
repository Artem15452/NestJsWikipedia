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
  @IsUUID() 
  authorId: string; 

  @ApiProperty({ example: 'How to build a NestJS app' })
  @IsString()
  title: string;

  @ApiProperty({
    type: [ArticleContentBlockDto],
    description: 'Масив блоків: текст, заголовки або зображення',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleContentBlockDto)
  content: ArticleContentBlockDto[];

  @ApiProperty({ example: '2026-03-01T12:00:00.000Z' })
  date: Date;

  @ApiProperty({
    example: [ArticleCategory.WEB, ArticleCategory.SECURITY],
    enum: ArticleCategory,
    isArray: true,
  })
  @IsArray()
  @IsEnum(ArticleCategory, { each: true })
  categories: ArticleCategory[];

  @ApiProperty({
    example: ['https://google.com'],
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  references: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  isApproved: boolean;
}