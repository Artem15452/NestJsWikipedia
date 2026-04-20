import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty({ example: 'https://res.cloudinary.com/...' })
  @IsUrl({}, { message: 'url має бути валідним посиланням' })
  url: string;

  @ApiProperty({ example: 'folder/image_id' })
  @IsString()
  publicId: string;
  
  @ApiProperty({ example: 'Верхній підпис (над фото)', required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Нижній підпис (під фото)', required: false })
  @IsOptional()
  @IsString()
  title: string;  
}
