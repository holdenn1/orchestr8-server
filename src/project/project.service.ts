import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { mapToProjectOwner } from './mapers/mapToProjectOwner';
import { mapToProjectMember } from './mapers/mapToProjectMember';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private userService: UserService,
  ) {}

  async create(userId: number, { titleProject, descriptionProject, membersIds }: CreateProjectDto) {
    const user = await this.userService.findOneById(userId);
    const getMembers = membersIds ? await this.userService.findAllByIds(membersIds) : [];

    return await this.projectRepository.save({
      titleProject,
      descriptionProject,
      members: mapToProjectMember(getMembers),
      owner: mapToProjectOwner(user),
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
    return await this.projectRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: Partial<UpdateProjectDto>) {
    const project = await this.findOneById(id);
    project.titleProject = dto.titleProject ?? project.titleProject;
    project.descriptionProject = dto.descriptionProject ?? project.descriptionProject;
    project.members = dto.membersIds ? await this.userService.findAllByIds(dto.membersIds) : project.members;
    return this.projectRepository.save({ ...project, members: mapToProjectMember(project.members) });
  }

  async remove(id: number) {
    const project = await this.findOneById(id);
    return await this.projectRepository.remove(project);
  }
}
