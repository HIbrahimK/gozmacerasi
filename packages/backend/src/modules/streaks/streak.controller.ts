import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StreakService } from './streak.service';

@Controller('streaks')
@UseGuards(JwtAuthGuard)
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get(':childId')
  getStreak(@Param('childId') childId: string) {
    return this.streakService.getStreak(childId);
  }

  @Post(':childId/play')
  recordPlay(@Param('childId') childId: string) {
    return this.streakService.recordPlay(childId);
  }
}
