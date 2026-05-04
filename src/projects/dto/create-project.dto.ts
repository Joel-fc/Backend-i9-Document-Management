import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  employeeIds?: string[];
}
