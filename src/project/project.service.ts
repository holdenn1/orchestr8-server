import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private userService: UserService,
  ) {}

  async create(
    userId: number,
    {
      titleProject,
      descriptionProject,
      participantsOnProject,
    }: CreateProjectDto,
  ) {
    const user = await this.userService.findOneById(userId);
    return await this.projectRepository.save({
      user,
      titleProject,
      descriptionProject,
      participantsOnProject,
    });
  }

  async findOneById(id: number) {
    return await this.projectRepository.find({ where: { id } });
  }

  async update(id: number, dto: Partial<UpdateProjectDto>) {
    return await this.projectRepository.update(id, dto);
  }

  async remove(id: number) {
    const project = await this.findOneById(id);
    return await this.projectRepository.remove(project);
  }
}
