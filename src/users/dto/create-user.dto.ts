import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsArray, IsOptional, IsEnum, MinLength, IsObject } from 'class-validator';
import { UserRole } from '../enum/UserRole';

export class CreateUserDto {
  @ApiProperty({ example: 'Artem' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'artem@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    required: false, 
    example: { url: 'https://...', publicId: '...' } 
  })
  @IsOptional()
  @IsObject()
  avatar?: {
    url: string;
    publicId: string;
  };

  @ApiProperty({ example: ['https://t.me/artem'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  socialLinks?: string[];

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;
}
