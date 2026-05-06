import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StoryService } from './story.service';

@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('definitions')
  getDefinitions() {
    return this.storyService.getStoryDefinitions();
  }

  @Get(':childId')
  getStoryProgress(@Param('childId') childId: string) {
    return this.storyService.getStoryProgress(childId);
  }

  @Post(':childId/unlock')
  unlockChapter(
    @Param('childId') childId: string,
    @Body('storyId') storyId: string,
    @Body('chapterId') chapterId: number,
  ) {
    return this.storyService.unlockChapter(childId, storyId, chapterId);
  }

  @Post(':childId/complete')
  completeChapter(
    @Param('childId') childId: string,
    @Body('storyId') storyId: string,
    @Body('chapterId') chapterId: number,
  ) {
    return this.storyService.completeChapter(childId, storyId, chapterId);
  }
}
