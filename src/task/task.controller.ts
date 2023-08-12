import {
  Body,
  Controller,
  Get,
  Param,
  Headers,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { StatusTask } from './types';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SocketGateway } from 'src/socket/socket.gateway';
import { NotificationType } from 'src/socket/types';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService, private readonly socketGateway: SocketGateway) {}

  @Post('create/:projectId')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Headers('socketId') socketId: string,
    @Param('projectId') projectId: string,
  ) {
    const addedTask = await this.taskService.create(+projectId, createTaskDto);
    this.socketGateway.emitToAll(NotificationType.ADD_TASK, {
      payload: addedTask,
      socketId,
    });
    return addedTask;
  }

  @Get('/:projectId/:status')
  @UseGuards(AccessTokenGuard)
  getTasks(
    @Param('projectId') projectId: string,
    @Param('status') status: StatusTask,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {

    
    return this.taskService.getTasks(+projectId, status, +page, +pageSize);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id') id: string,
    @Headers('socketId') socketId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const updatedTask = await this.taskService.updateTask(+id, updateTaskDto);
    this.socketGateway.emitToAll(NotificationType.UPDATE_TASK, {
      payload: updatedTask,
      socketId,
    });

    return updatedTask;
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async remove(@Param('id') id: string, @Headers('socketId') socketId: string) {
    const removedTask = await this.taskService.remove(+id);
    this.socketGateway.emitToAll(NotificationType.REMOVE_TASK, {
      payload: removedTask,
      socketId,
    });
    return removedTask;
  }

  @Get('tasks/count/:projectId')
  @UseGuards(AccessTokenGuard)
  getTasksCountsByStatus(@Param('projectId') projectId: string) {
    return this.taskService.getTasksCountsByStatus(+projectId);
  }
}
