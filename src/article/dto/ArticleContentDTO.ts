import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export class ArticleContentBlockDto {
  @ApiProperty({
    example: 'text',
    enum: ['text', 'header', 'image'],
    description: 'Тип блоку контенту',
  })
  @IsEnum(['text', 'header', 'image'])
  type: 'text' | 'header' | 'image';

  @ApiProperty({
    example: 'React is a library for building interfaces',
    description: 'Текст або URL зображення',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
