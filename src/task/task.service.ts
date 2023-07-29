import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { ProjectService } from 'src/project/project.service';
import { mapTaskToProfile, mapTasksToProfile } from './mapers';
import { StatusTask } from './types';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private projectService: ProjectService,
  ) {}

  async create(projectId: number, { task }: CreateTaskDto) {
    const project = await this.projectService.findOneById(projectId);
    if (project) {
      const createdTask = await this.taskRepository.save({
        task,
        project,
      });
      return mapTaskToProfile(createdTask);
    }
  }

  async findAllTasksByUser(projectId: number) {
    return await this.taskRepository.find({
      where: {
        project: {
          id: projectId,
        },
      },
      order: {
        completed: 'ASC',
        createAt: 'ASC',
      },
    });
  }

  async getTasks(projectId: number, status: StatusTask) {
    if (status === StatusTask.ALL) {
      const findTasks = await this.findAllTasksByUser(projectId);
      return mapTasksToProfile(findTasks);
    } else if (status === StatusTask.COMPLETED) {
      const findTasks = await this.taskRepository.find({
        where: {
          project: {
            id: projectId,
          },
          completed: true,
        },
        order: {
          completed: 'ASC',
          createAt: 'ASC',
        },
      });
      return mapTasksToProfile(findTasks);
    }
  }

  async findOneById(id: number) {
    return await this.taskRepository.findOne({
      where: { id },
    });
  }

  async updateTask(id: number, dto: Partial<UpdateTaskDto>) {
    const task = await this.findOneById(id);
    task.task = dto.task ?? task.task;
    task.completed = dto.completed ?? task.completed;
    return this.taskRepository.save({ ...task });
  }

  async remove(id: number) {
    const task = await this.findOneById(id);
    return await this.taskRepository.remove(task);
  }

  async getTasksCountsByStatus(projectId: number) {
    const result = await this.taskRepository
      .createQueryBuilder('task')
      .select('COUNT(*)', 'totalCount')
      .addSelect('SUM(CASE WHEN task.completed = true THEN 1 ELSE 0 END)', 'completed')
      .leftJoin('task.project', 'project')
      .where('project.id = :projectId', { projectId })
      .groupBy('project.id')
      .getRawMany();
    return result;
  }
}
