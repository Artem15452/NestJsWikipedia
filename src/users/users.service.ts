import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async register(dto: CreateUserDto) {
    try {
      const Email = dto.email.toLowerCase();
      const existingUser = await this.userRepository.findOne({
        where : {email: Email},
      });

      if(existingUser){
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const newUser = await this.userRepository.create({
        ...dto,
        email : Email,
        password: hashedPassword,
      });
      await this.userRepository.save(newUser);
    } catch(error){
      if(error instanceof ConflictException){
        throw error;
      }
    }
  }

  async login(dto: LoginUserDto) {
    const Email = dto.email.toLowerCase();
    const user = await this.userRepository.findOne({
      where: {email: Email}
    });

    if(!user){
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if(!isPasswordValid){
      throw new UnauthorizedException('User does not registration');
    }
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