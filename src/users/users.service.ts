import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MediaService } from '../media/media.service';
import { Media } from '../media/entities/media.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mediaService: MediaService,
  ) {}

  async setAvatar(userId: number, avatarData: { url: string; publicId: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['avatar'],
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.avatar) {
      await this.mediaService.remove(user.avatar.id);
    }

    const newAvatar = new Media();
    newAvatar.url = avatarData.url;
    newAvatar.publicId = avatarData.publicId;

    user.avatar = newAvatar;
    return await this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userEntity = this.userRepository.create(createUserDto);
    return await this.userRepository.save(userEntity);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['avatar'],
    });
  }

  async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new Error('User not found');
    }

    this.userRepository.merge(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.remove(user);
  }
}
