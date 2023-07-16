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
  titleProject: string;

  @IsString()
  descriptionProject: string;

  @IsArray()
  @IsOptional()
  membersIds: number[];
}
