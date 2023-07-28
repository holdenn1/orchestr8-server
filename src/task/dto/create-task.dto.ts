import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  task: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
