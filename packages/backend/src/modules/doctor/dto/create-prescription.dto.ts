import { IsArray, IsInt, IsObject, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreatePrescriptionDto {
  @IsString()
  childId!: string;

  @IsString()
  @MinLength(2)
  diagnosis!: string;

  @IsObject()
  targetGoals!: Record<string, boolean>;

  @IsArray()
  recommendedGames!: Array<{ gameId: string; reason: string }>;

  @IsOptional()
  @IsString()
  difficultyRange?: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  dailyLimitMinutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
