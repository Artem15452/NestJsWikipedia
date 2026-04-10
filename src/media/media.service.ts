import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import { CloudinaryService } from './CloudinaryService';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findById(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media;
  }

  async remove(id: number): Promise<void> {
    const media = await this.findById(id);
    await this.cloudinaryService.deleteImage(media.publicId);

    await this.mediaRepository.remove(media);
  }

  async update(id: number, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const media = await this.findById(id);

    this.mediaRepository.merge(media, updateMediaDto);
    return await this.mediaRepository.save(media);
  }

  async updateImage(oldPublicId: string, newFile: Express.Multer.File) {
    try {
      await this.cloudinaryService.deleteImage(oldPublicId);
    } catch (error) {
      console.warn(`Could not delete old image with ID ${oldPublicId} from Cloudinary`);
    }

    const result = await this.cloudinaryService.uploadImage(newFile);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
}
