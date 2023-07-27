import { Body, Controller, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create/:projectId')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createTasktDto: CreateTaskDto, @Param('projectId') projectId: string) {
    return this.taskService.create(+projectId, createTasktDto);
  }
}
