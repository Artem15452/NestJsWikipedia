import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MediaService } from '../media/media.service';
import { Media } from '../media/entities/media.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mediaService: MediaService,
  ) {}

  async setAvatar(userId: string, avatarData: { url: string; publicId: string }): Promise<User> {
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

  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) throw new BadRequestException('Користувач з таким email вже існує');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['avatar'],
    });
  }

  async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ 
      where: { email },
      relations: ['avatar'] 
    });
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');
    
    await this.userRepository.remove(user);
  }
}