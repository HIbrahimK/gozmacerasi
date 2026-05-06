import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AdaptiveModule } from './modules/adaptive/adaptive.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { CalibrationModule } from './modules/calibration/calibration.module';
import { ChildrenModule } from './modules/children/children.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { GamesModule } from './modules/games/games.module';
import { ParentModule } from './modules/parent/parent.module';
import { QuestModule } from './modules/quests/quest.module';
import { ScoringModule } from './modules/scoring/scoring.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { StreakModule } from './modules/streaks/streak.module';
import { StoryModule } from './modules/stories/story.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    AdminModule,
    AdaptiveModule,
    BooksModule,
    CalibrationModule,
    ParentModule,
    DoctorModule,
    ScoringModule,
    QuestModule,
    StreakModule,
    StoryModule,
    ChildrenModule,
    GamesModule,
    SessionsModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
