import { extname } from 'path';
import { diskStorage } from 'multer';
import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('file-upload')
@UseGuards(JwtAuthGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.uploadFile(req.user.userId, file);
  }

  @Delete(':id')
  async removeFile(@Param('id') id: string) {
    return this.fileUploadService.removeFile(id);
  }
}
