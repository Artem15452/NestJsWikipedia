import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum ContentBlockType {
  TEXT = 'text',
  HEADER = 'header',
  SECTION = 'section',
  IMAGE = 'image',
  SLIDER = 'slider', 
}

export class MediaItemDto {
  @IsUrl()
  url: string;

  @IsString()
  publicId: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  title?: string;
}

export class ArticleContentBlockDto {
  @ApiProperty({ enum: ContentBlockType })
  @IsEnum(ContentBlockType)
  type: ContentBlockType;

  @IsOptional() @IsString()
  value?: string;

  @IsOptional() @IsString()
  sectionHeader?: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  sectionTexts?: string[];

  @IsOptional() @IsUrl()
  url?: string;

  @IsOptional() @IsString()
  publicId?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  images?: MediaItemDto[];
}
