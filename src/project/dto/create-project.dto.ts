import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

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
  members: User[];
}
