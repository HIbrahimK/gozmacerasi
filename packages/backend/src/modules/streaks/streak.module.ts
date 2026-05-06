import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StreakController } from './streak.controller';
import { StreakService } from './streak.service';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [PrismaModule, AnalyticsModule],
  controllers: [StreakController],
  providers: [StreakService],
  exports: [StreakService],
})
export class StreakModule {}
