import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//makes the module gloablly scoped
@Global()
@Module({
  // registering prisma service in this module
  providers: [PrismaService],

  //ensuring prisma service is exported for other modules
  exports: [PrismaService],
})
export class PrismaModule {}
