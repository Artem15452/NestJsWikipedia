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

  // --- Поля для зображень (type: image) ---

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/dt8opuz2k/image/upload/v1.jpg', 
    required: false,
    description: 'Пряме посилання на зображення (тільки для type: image)'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Поле url має бути валідним посиланням' })
  url?: string;

  @ApiProperty({ 
    example: 'articles/photo_123', 
    required: false,
    description: 'ID файлу в Cloudinary (потрібно для видалення/редагування)'
  })
  @IsOptional()
  @IsString()
  publicId?: string;

  @ApiProperty({ 
    example: 'Верхній підпис який над фото кароче', 
    required: false,
    description: 'Опис, що відображається над зображенням'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: 'Нижній підпис який з нижче фото кароче', 
    required: false,
    description: 'Заголовок, що відображається під зображенням'
  })
  @IsOptional()
  @IsString()
  title?: string;
}
