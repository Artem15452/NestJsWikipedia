import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Реєстрація нового користувача' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список усіх користувачів' })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Patch(':id/avatar')
  @ApiOperation({ summary: 'Встановити аватар користувача' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://res.cloudinary.com/dt8opuz2k/image/upload/v1/avatar.jpg',
        },
        publicId: { type: 'string', example: 'avatars/user_1_abc' },
      },
      required: ['url', 'publicId'],
    },
  })

  async setAvatar(
    @Param('id') id: string,
    @Body() avatarData: { url: string; publicId: string }
  ) {
    return await this.usersService.setAvatar(+id, avatarData);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Знайти користувача за email' })
  async findOne(@Param('email') email: string): Promise<User | null> {
    return await this.usersService.findOne(email);
  }

  @Patch(':email')
  @ApiOperation({ summary: 'Оновити дані користувача' })
  async update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(email, updateUserDto);
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Видалити користувача' })
  async remove(@Param('email') email: string) {
    return await this.usersService.remove(email);
  }
}
