import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsArray } from 'class-validator';

export enum ContentBlockType {
  TEXT = 'text',
  HEADER = 'header',
  SECTION = 'section', 
  IMAGE = 'image',
}

export class ArticleContentBlockDto {
  @ApiProperty({ 
    enum: ContentBlockType, 
    example: 'section', 
    description: 'Тип блоку контенту' 
  })
  @IsEnum(ContentBlockType)
  type: ContentBlockType;

  @ApiProperty({ example: 'Простий текст або заголовок', required: false })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({ 
    example: 'Історія створення', 
    required: false,
    description: 'Назва абзацу (Header)'
  })
  @IsOptional()
  @IsString()
  sectionHeader?: string;

  @ApiProperty({ 
    example: ['Перший абзац тексту', 'Другий абзац тексту'], 
    required: false,
    description: 'Масив текстів абзацу (Text array)'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sectionTexts?: string[];

  
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() publicId?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() title?: string;
}
