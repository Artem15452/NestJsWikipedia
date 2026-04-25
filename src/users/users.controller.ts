import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }


  @Post()
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Отримати список усіх користувачів' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.usersService.findAll(paginationDto);
  }

  @Patch(':id/avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Встановити аватар користувача' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://res.cloudinary.com/dt8opuz2k/image/upload/v1/avatar.jpg',
        },
        publicId: { type: 'string', example: 'avatars/user_abc' },
      },
      required: ['url', 'publicId'],
    },
  })
  async setAvatar(
    @Param('id') id: string, 
    @Body() avatarData: { url: string; publicId: string }
  ) {

    return await this.usersService.setAvatar(id, avatarData);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Знайти користувача за email' })
  async findOne(@Param('email') email: string): Promise<User | null> {
    return await this.usersService.findOne(email);
  }

  @Patch(':email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновити дані користувача' })
  async update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(email, updateUserDto);
  }

  @Delete(':email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Видалити користувача' })
  async remove(@Param('email') email: string) {
    return await this.usersService.remove(email);
  }
}