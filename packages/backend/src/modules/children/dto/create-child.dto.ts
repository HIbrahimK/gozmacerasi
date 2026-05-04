import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateChildDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  dailyLimitMinutes?: number;
}
