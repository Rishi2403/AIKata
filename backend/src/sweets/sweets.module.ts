import { Module } from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { SweetsController } from './sweets.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SweetsController],
  providers: [SweetsService],
  exports: [SweetsService],
})
export class SweetsModule {}