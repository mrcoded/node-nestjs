import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DestinationsModule } from './destinations/destinations.module';
import { FileUploadService } from './file-upload/file-upload.service';
import { FileUploadModule } from './file-upload/file-upload.module';
import { FileUploadController } from './file-upload/file-upload.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    DestinationsModule,
    FileUploadModule,
  ],
  controllers: [AppController, FileUploadController],
  providers: [AppService, PrismaService, FileUploadService],
})
export class AppModule {}
