import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsUrl } from 'class-validator';

export enum ContentBlockType {
  TEXT = 'text',
  IMAGE = 'image',
  HEADER = 'header',
}

export class ArticleContentBlockDto {
  @ApiProperty({ 
    enum: ContentBlockType, 
    example: 'text', 
    description: 'Тип блоку: текст, підзаголовок або зображення' 
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

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/dt8opuz2k/image/upload/v1.jpg', 
    required: false,
    description: 'Пряме посилання на зображення (тільки для type: image)'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Поле url має бути валідним посиланням' })
  url?: string;

  @ApiProperty({ 
    example: 'Підпис під фото: Архітектура NestJS', 
    required: false,
    description: 'Опціональний підпис під зображенням'
  })
  @IsOptional()
  @IsString()
  caption?: string;
}
