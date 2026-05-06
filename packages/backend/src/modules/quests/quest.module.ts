import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [PrismaModule, AnalyticsModule],
  controllers: [QuestController],
  providers: [QuestService],
  exports: [QuestService],
})
export class QuestModule {}
