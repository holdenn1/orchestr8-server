import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { StatusTask } from './types';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create/:projectId')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createTaskDto: CreateTaskDto, @Param('projectId') projectId: string) {
    return this.taskService.create(+projectId, createTaskDto);
  }

  @Get('/:projectId/:status')
  @UseGuards(AccessTokenGuard)
  getTasks(@Param('projectId') projectId: string, @Param('status') status: StatusTask) {
    return this.taskService.getTasks(+projectId, status);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(+id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }

  @Get('tasks/count/:projectId')
  @UseGuards(AccessTokenGuard)
  getTasksCountsByStatus(@Param('projectId') projectId: string) {
    return this.taskService.getTasksCountsByStatus(+projectId);
  }
}
