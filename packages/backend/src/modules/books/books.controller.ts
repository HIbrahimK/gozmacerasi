import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BooksService } from './books.service';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  list() {
    return this.booksService.list();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.booksService.getById(id);
  }

  @Post(':id/start')
  startReading(
    @Param('id') bookId: string,
    @Body('childId') childId: string,
  ) {
    return this.booksService.startReading(childId, bookId);
  }

  @Post('reading/:sessionId/finish')
  finishReading(@Param('sessionId') sessionId: string) {
    return this.booksService.finishReading(sessionId);
  }

  @Get('history/:childId')
  getReadingHistory(@Param('childId') childId: string) {
    return this.booksService.getReadingHistory(childId);
  }
}
