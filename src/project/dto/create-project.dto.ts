import {
  IsArray,
  IsEmail,
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
  @IsEmail(
    {},
    {
      each: true,
      message: 'Invalid email address',
    },
  )
  usersOnProject: string[];
}
