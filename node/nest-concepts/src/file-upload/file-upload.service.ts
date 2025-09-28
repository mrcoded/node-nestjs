import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    description: string | undefined,
    user: User,
  ): Promise<File> {
    try {
      const result = await this.cloudinaryService.uploadFile(file);

      const newlySavedFile = this.fileRepository.create({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        publicId: result?.public_id,
        url: result?.secure_url,
        description,
        uploader: user,
      });

      // fs.unlinkSync(file.path);

      return this.fileRepository.save(newlySavedFile);
    } catch (error) {
      //removing temp file
      // if (file.path && fs.existsSync(file.path)) {
      //   fs.unlinkSync(file.path);
      // }

      throw new InternalServerErrorException('File Upload failed! Try again');
    }
  }

  async findAll(): Promise<File[]> {
    return this.fileRepository.find({
      relations: ['uploader'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const file = await this.fileRepository.findOne({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    //removing file from cloudinary
    await this.cloudinaryService.deleteFile(file.publicId);
    //removing file from database
    await this.fileRepository.remove(file);

    return {
      message: 'File deleted successfully',
    };
  }
}
