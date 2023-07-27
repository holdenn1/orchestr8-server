import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { ProjectService } from 'src/project/project.service';
import { mapTaskToProfile } from './mapers';

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
}
