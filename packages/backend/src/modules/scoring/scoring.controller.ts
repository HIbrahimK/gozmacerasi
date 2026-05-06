import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScoringService, ScoreInput } from './scoring.service';

@Controller('scores')
@UseGuards(JwtAuthGuard)
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post()
  calculateScore(@Body() input: ScoreInput) {
    return this.scoringService.calculateAndStore(input);
  }

  @Get('child/:childId')
  getScoresByChild(@Param('childId') childId: string) {
    return this.scoringService.getScoresByChild(childId);
  }

  @Get('vision/:childId')
  getWeeklyVisionScores(@Param('childId') childId: string) {
    return this.scoringService.getWeeklyVisionScores(childId);
  }
}
