import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { StatusTask } from './types';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create/:projectId')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createTasktDto: CreateTaskDto, @Param('projectId') projectId: string) {
    return this.taskService.create(+projectId, createTasktDto);
  }

  @Get('/:projectId/:status')
  @UseGuards(AccessTokenGuard)
  getTasks(@Param('projectId') projectId: string, @Param('status') status: StatusTask) {
    return this.taskService.getTasks(+projectId, status);
  }
}
