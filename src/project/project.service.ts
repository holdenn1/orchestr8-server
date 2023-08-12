import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { mapToProjectOwner, mapToProjectMembers, mapToProject, mapToProjects } from './mapers';
import { StatusProject } from './types';

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

  async updateProject(id: number, dto: Partial<UpdateProjectDto>) {
    const project = await this.findOneById(id);
    project.title = dto.title ?? project.title;
    project.description = dto.description ?? project.description;
    project.status = dto.status ?? project.status;
    project.members = dto.membersIds ? await this.userService.findAllByIds(dto.membersIds) : project.members;
    return this.projectRepository.save({ ...project, members: mapToProjectMembers(project.members) });
  }

  async remove(id: number) {
    const project = await this.findOneById(id);
    const removerProject = await this.projectRepository.remove(project);
    if (!removerProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return { ...removerProject, id };
  }

  async searchMembers(searchEmail: string, userId: number) {
    return await this.userService.searchUsersByEmail(searchEmail, userId);
  }

  async findOneById(id: number) {
    return await this.projectRepository.findOne({
      where: { id },
      relations: { members: true, owner: true, tasks: true },
    });
  }

  /* find own projects */

  async findAllOwnProjectsByUser(userId: number, skip: number, take: number) {
    return await this.projectRepository.find({
      relations: {
        owner: true,
        members: true,
        tasks: true,
      },
      where: {
        owner: {
          id: userId,
        },
      },
      order: {
        createAt: 'DESC',
      },
      skip,
      take,
    });
  }

  async getOwnProjects(userId: number, status: StatusProject, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    
    if (status === StatusProject.ALL) {
      const findProjects = await this.findAllOwnProjectsByUser(userId, skip, pageSize);
      return mapToProjects(findProjects);
    } else {
      const findProjects = await this.projectRepository.find({
        relations: {
          owner: true,
          members: true,
          tasks: true,
        },
        where: {
          owner: {
            id: userId,
          },
          status,
        },
        order: {
          createAt: 'DESC',
        },
        skip,
        take: pageSize,
      });
      return mapToProjects(findProjects);
    }
  }

  async geOwnProjectCountsByStatus(userId: number) {
    const result = await this.projectRepository
      .createQueryBuilder('project')
      .select('COUNT(*)', 'totalCount')
      .addSelect('SUM(CASE WHEN project.status = :completed THEN 1 ELSE 0 END)', 'completed')
      .addSelect('SUM(CASE WHEN project.status = :progress THEN 1 ELSE 0 END)', 'in-progress')
      .addSelect('SUM(CASE WHEN project.status = :suspend THEN 1 ELSE 0 END)', 'suspend')
      .leftJoin('project.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .groupBy('owner.id')
      .setParameters({
        completed: 'completed',
        progress: 'in-progress',
        suspend: 'suspend',
      })
      .getRawMany();
    return result;
  }
  /* ====================================================================================== */

  /* find Foreign projects */

  async findAllForeignProjectsByUser(userId: number, skip: number, take: number) {
    return await this.projectRepository.find({
      relations: {
        owner: true,
        members: true,
        tasks: true,
      },
      where: {
        members: {
          id: userId,
        },
      },
      order: {
        createAt: 'ASC',
      },
      skip,
      take,
    });
  }

  async getForeignProjects(userId: number, status: StatusProject, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    if (status === StatusProject.ALL) {
      const findProjects = await this.findAllForeignProjectsByUser(userId, skip, pageSize);
      return mapToProjects(findProjects);
    } else {
      const findProjects = await this.projectRepository.find({
        relations: {
          owner: true,
          members: true,
          tasks: true,
        },
        where: {
          members: {
            id: userId,
          },
          status,
        },
        order: {
          createAt: 'ASC',
        },
        skip,
        take: pageSize,
      });
      return mapToProjects(findProjects);
    }
  }

  async geForeignProjectCountsByStatus(userId: number) {
    const result = await this.projectRepository
      .createQueryBuilder('project')
      .select('COUNT(*)', 'totalCount')
      .addSelect('SUM(CASE WHEN project.status = :completed THEN 1 ELSE 0 END)', 'completed')
      .addSelect('SUM(CASE WHEN project.status = :progress THEN 1 ELSE 0 END)', 'in-progress')
      .addSelect('SUM(CASE WHEN project.status = :suspend THEN 1 ELSE 0 END)', 'suspend')
      .leftJoin('project.members', 'members')
      .where('members.id = :userId', { userId })
      .groupBy('members.id')
      .setParameters({
        completed: 'completed',
        progress: 'in-progress',
        suspend: 'suspend',
      })
      .getRawMany();
    return result;
  }

  /* ====================================================================================== */
}
