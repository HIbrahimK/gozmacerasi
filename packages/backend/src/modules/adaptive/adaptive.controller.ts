import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdaptiveService } from './adaptive.service';

class AdjustDifficultyDto {
  gameSessionId!: string;
  accuracy!: number;
  reactionTimeMs!: number;
  motorSmoothness?: number;
  dominantEyeBias?: number;
}

@Controller('adaptive')
@UseGuards(JwtAuthGuard)
export class AdaptiveController {
  constructor(private readonly adaptiveService: AdaptiveService) {}

  @Post('adjust')
  adjustDifficulty(@Body() dto: AdjustDifficultyDto) {
    return this.adaptiveService.adjustDifficulty(
      dto.gameSessionId,
      dto.accuracy,
      dto.reactionTimeMs,
      dto.motorSmoothness,
      dto.dominantEyeBias,
    );
  }

  @Get('history/:childId')
  getHistory(
    @Param('childId') childId: string,
    @Query('gameId') gameId?: string,
  ) {
    return this.adaptiveService.getAdaptiveHistory(childId, gameId);
  }

  @Get('difficulty/:childId/:gameId')
  getLastDifficulty(
    @Param('childId') childId: string,
    @Param('gameId') gameId: string,
  ) {
    return this.adaptiveService.getLastDifficulty(childId, gameId);
  }
}
