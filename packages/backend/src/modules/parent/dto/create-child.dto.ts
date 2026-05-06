import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateChildByParentDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsInt()
  @Min(1)
  age!: number;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  baselineVA?: string;

  @IsOptional()
  @IsString()
  stereopsisLevel?: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  dailyLimit?: number;
}
