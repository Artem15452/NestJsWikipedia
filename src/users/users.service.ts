import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MediaService } from '../media/media.service';
import { Media } from '../media/entities/media.entity';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mediaService: MediaService,
  ) {}

  // Виправлено: тепер метод працює стабільно
  async setAvatar(userId: string, avatarData: { url: string; publicId: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['avatar'],
    });

    if (!user) throw new NotFoundException('User not found');

    // Видаляємо стару аватарку з Cloudinary та БД, якщо вона була
    if (user.avatar) {
      await this.mediaService.remove(user.avatar.id);
    }

    const newAvatar = new Media();
    newAvatar.url = avatarData.url;
    newAvatar.publicId = avatarData.publicId;

    user.avatar = newAvatar;
    return await this.userRepository.save(user);
  }

  // Об'єднав register та create в один логічний метод
  async register(dto: CreateUserDto): Promise<User> {
    const email = dto.email.toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepository.create({
      ...dto,
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
      relations: ['avatar'],
    });

    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<User>> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      relations: ['avatar'],
      skip,
      take: limit,
    });

    return new PaginatedResponseDto(users, page, limit, total);
  }

  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['avatar'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(email);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(email: string): Promise<void> {
    const user = await this.findOne(email);
    await this.userRepository.remove(user);
  }
}
