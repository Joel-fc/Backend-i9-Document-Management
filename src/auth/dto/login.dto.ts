import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateLoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

