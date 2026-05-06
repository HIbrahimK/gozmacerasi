import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(['PARENT', 'DOCTOR', 'ADMIN', 'CHILD'])
  role?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
