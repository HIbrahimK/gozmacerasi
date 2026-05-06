import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuestService } from './quest.service';

@Controller('quests')
@UseGuards(JwtAuthGuard)
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get('definitions')
  getDefinitions() {
    return this.questService.getAvailableQuests();
  }

  @Get(':childId')
  getDailyQuests(@Param('childId') childId: string) {
    return this.questService.getDailyQuests(childId);
  }

  @Post(':childId/complete')
  completeQuest(
    @Param('childId') childId: string,
    @Body('questId') questId: string,
  ) {
    return this.questService.completeQuest(childId, questId);
  }

  @Get(':childId/xp')
  getTotalXp(@Param('childId') childId: string) {
    return this.questService.getTotalXp(childId);
  }
}
