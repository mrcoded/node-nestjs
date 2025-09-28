import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Global Validation of incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove all fields that are not in the DTO
      forbidNonWhitelisted: true, // throw an error if there are non-whitelisted fields
      transform: true, // transform the data to the type of the DTO
      disableErrorMessages: false,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
