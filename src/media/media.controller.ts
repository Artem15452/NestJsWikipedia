import { Controller, Post, Patch, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service'; // Додано імпорт сервісу
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
  ) {}

  @Post('upload-temp')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Завантажити фото на Cloudinary' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadTempFile(@UploadedFile() file: Express.Multer.File) {

    const result = await this.mediaService.updateImage('', file); 
    return {
      url: result.url,
      publicId: result.publicId,
    };
  }

  @Patch('update-photo/:oldPublicId')
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'oldPublicId', description: 'ID фото в Cloudinary, яке треба видалити' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Замінити існуюче фото на нове в Cloudinary' })
  @UseInterceptors(FileInterceptor('file'))
  async updatePhoto(
    @Param('oldPublicId') oldPublicId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {

    return await this.mediaService.updateImage(oldPublicId, file);
  }
}
