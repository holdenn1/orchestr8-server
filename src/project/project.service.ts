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
    { titleProject, descriptionProject, members }: CreateProjectDto,
  ) {
    console.log(members);
    
    const user = await this.userService.findOneById(userId);
    return await this.projectRepository.save({
      titleProject,
      descriptionProject,
      members,
      owner: user,
    });
  }

  async find() {
    return await this.projectRepository.find({
      relations: {
        owner: true,
        members: true,
        tasks: true,
      },
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
