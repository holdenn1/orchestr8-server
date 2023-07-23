import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(255, {
    message: 'Title is too long',
  })
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsOptional()
  membersIds: number[];
}
