import * as fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  constructor(private readonly prisma: PrismaService) {
    cloudinary.config({
      CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    });
  }

  async uploadFile(userId: number, file: Express.Multer.File) {
    try {
      const result = await this.uploadToCloudinary(file.path);

      const newlySavedFile = await this.prisma.file.create({
        data: {
          filename: file.originalname,
          publicId: result.public_id,
          url: result.secure_url,
          userId,
        },
      });

      fs.unlinkSync(file.path);

      return newlySavedFile;
    } catch (error) {
      //removing temp file
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new InternalServerErrorException('File Upload failed! Try again');
    }
  }

  private uploadToCloudinary(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(filePath, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async removeFile(fileId: string) {
    try {
      const file = await this.prisma.file.findUnique({
        where: {
          id: fileId,
        },
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }

      //removing file from cloudinary
      await cloudinary.uploader.destroy(file.publicId);
      //removing file from database
      await this.prisma.file.delete({ where: { id: fileId } });

      return {
        message: 'File deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('File Deletion failed! Try again');
    }
  }
}
