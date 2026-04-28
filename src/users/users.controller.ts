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
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
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
    return await this.usersService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизація' })
  async login(@Body() dto: LoginUserDto) {
    return await this.usersService.login(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Список усіх користувачів з пагінацією' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.usersService.findAll(paginationDto);
  }

  @Patch(':id/avatar')
  @ApiOperation({ summary: 'Встановити аватар' })
  async setAvatar(
    @Param('id') id: string,
    @Body() avatarData: { url: string; publicId: string }
  ) {
    return await this.usersService.setAvatar(id, avatarData);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Пошук за email' })
  async findOne(@Param('email') email: string) {
    return await this.usersService.findOne(email);
  }

  @Patch(':email')
  @ApiOperation({ summary: 'Оновлення профілю' })
  async update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(email, updateUserDto);
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Видалення користувача' })
  async remove(@Param('email') email: string) {
    return await this.usersService.remove(email);
  }
}
