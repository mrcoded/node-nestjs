import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import Joi from 'joi';
import { PostsModule } from './posts/posts.module';
import { User } from './auth/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { FileUploadModule } from './file-upload/file-upload.module';
import { File } from './file-upload/entities/file.entity';
import { EventsModule } from './events/events.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    CacheModule.register({
      isGlobal: true,
      ttl: 30000,
      max: 100,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Coded200$',
      database: 'nestjs-travel-tracker',
      entities: [Post, User, File], //array of entities you want to regster
      synchronize: true, //dont push to production
    }),
    ConfigModule.forRoot({
      isGlobal: true, // make it globally available
      // validationSchema: Joi.object({
      //   APP_NAME: Joi.string().default('defaultApp'),
      // }),
      load: [appConfig],
    }),
    PostsModule,
    AuthModule,
    FileUploadModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //apply middleware for all routes
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
