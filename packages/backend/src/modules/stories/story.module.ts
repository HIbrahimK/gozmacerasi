import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [PrismaModule, AnalyticsModule],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
