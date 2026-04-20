import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum ContentBlockType {
  TEXT = 'text',
  IMAGE = 'image',
  HEADER = 'header',
  SLIDER = 'slider', 
}

export class MediaItemDto {
  @ApiProperty({ example: 'https://res.cloudinary.com/...' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'articles/photo_123' })
  @IsString()
  publicId: string;

  @ApiProperty({ example: 'Верхній підпис', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Нижній підпис', required: false })
  @IsOptional()
  @IsString()
  title?: string;
}

export class ArticleContentBlockDto {
  @ApiProperty({ 
    enum: ContentBlockType, 
    example: 'text', 
    description: 'Тип блоку: текст, підзаголовок, зображення або слайдер' 
  })
  @IsEnum(ContentBlockType)
  type: ContentBlockType;

  @ApiProperty({ 
    example: 'Це вміст текстового блоку або заголовок розділу', 
    required: false,
    description: 'Використовується для типів text та header'
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  publicId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    type: [MediaItemDto], 
    required: false,
    description: 'Масив зображень для слайдера (тільки для type: slider)' 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  images?: MediaItemDto[];
}
