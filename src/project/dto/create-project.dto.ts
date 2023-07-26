import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { StatusProject } from '../types';

export class CreateProjectDto {
  @IsString()
  @MaxLength(255, {
    message: 'Title is too long',
  })
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  status: StatusProject;

  @IsArray()
  @IsOptional()
  membersIds: number[];
}
