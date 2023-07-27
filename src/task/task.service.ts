import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { ProjectService } from 'src/project/project.service';
import { mapTaskToProfile, mapTasksToProfile } from './mapers';
import { StatusTask } from './types';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepositoty: Repository<Task>,
    private projectService: ProjectService,
  ) {}

  async create(projectId: number, { task }: CreateTaskDto) {
    const project = await this.projectService.findOneById(projectId);
    if (project) {
      const createdTask = await this.taskRepositoty.save({
        task,
        project,
      });
      return mapTaskToProfile(createdTask);
    }
  }

  async findAllTasksByUser(projectId: number) {
    return await this.taskRepositoty.find({
      relations: {
        project: true,
      },
      where: {
        project: {
          id: projectId,
        },
      },
    });
  }

  async getTasks(projectId: number, status: StatusTask) {
    if (status === StatusTask.ALL) {
      const findTasks = await this.findAllTasksByUser(projectId);
      return mapTasksToProfile(findTasks);
    } else if (status === StatusTask.COMPLETED) {
      const findTasks = await this.taskRepositoty.find({
        relations: {
          project: true,
        },
        where: {
          project: {
            id: projectId,
          },
          completed: true,
        },
      });
      return mapTasksToProfile(findTasks);
    }
  }
}
