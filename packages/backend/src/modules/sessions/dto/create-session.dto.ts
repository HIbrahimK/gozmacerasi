import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  childId!: string;

  @IsString()
  gameId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @IsOptional()
  @IsInt()
  accuracy?: number;

  @IsOptional()
  @IsInt()
  reactionTimeMs?: number;
}
