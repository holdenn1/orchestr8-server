import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { mapToProjectOwner, mapToProjectMembers, mapToProject, mapToProjects } from './mapers';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private userService: UserService,
  ) {}

  async create(userId: number, { title, description, membersIds }: CreateProjectDto) {
    const user = await this.userService.findOneById(userId);
    const getMembers = membersIds ? await this.userService.findAllByIds(membersIds) : [];
    const project = await this.projectRepository.save({
      title,
      description,
      members: mapToProjectMembers(getMembers),
      owner: mapToProjectOwner(user),
    });
    return mapToProject(project);
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
    return await this.projectRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: Partial<UpdateProjectDto>) {
    const project = await this.findOneById(id);
    project.title = dto.title ?? project.title;
    project.description = dto.description ?? project.description;
    project.members = dto.membersIds ? await this.userService.findAllByIds(dto.membersIds) : project.members;
    return this.projectRepository.save({ ...project, members: mapToProjectMembers(project.members) });
  }

  async remove(id: number) {
    const project = await this.findOneById(id);
    return await this.projectRepository.remove(project);
  }

  async searchMembers(searchEmail: string, userId: number) {
    return await this.userService.searchUsersByEmail(searchEmail, userId);
  }

  async getOwnProject(userId: number) {
    const project = await this.projectRepository.find({
      where: {
        owner: {
          id: userId,
        },
      },
      relations: {
        owner: true,
        members: true,
        tasks: true,
      },
    });
    return mapToProjects(project);
  }
}
