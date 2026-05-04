import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  therapyTarget?: string;

  @IsOptional()
  @IsInt()
  @Min(3)
  minAge?: number;

  @IsOptional()
  @IsInt()
  @Min(3)
  maxAge?: number;

  @IsOptional()
  @IsBoolean()
  isPlayable?: boolean;
}
