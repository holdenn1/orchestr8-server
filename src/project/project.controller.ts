import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  UsePipes,
  Headers,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { StatusProject } from './types';
import { SocketGateway } from 'src/socket/socket.gateway';
import { NotificationType } from 'src/socket/types';
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Post('create')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Headers('socketId') socketId: string,
    @Req() req,
  ) {
    const createdProject = await this.projectService.create(+req.user.sub, createProjectDto);
    this.socketGateway.emitToAll(NotificationType.CREATE_PROJECT, { payload: createdProject, socketId });
    return createdProject;
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id') id: string,
    @Headers('socketId') socketId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectService.updateProject(+id, updateProjectDto);
    this.socketGateway.emitToAll(NotificationType.UPDATE_COUNT_PROJECT, { socketId });
    return project;
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async remove(@Param('id') id: string, @Headers('socketId') socketId: string) {
    const removedProject = await this.projectService.remove(+id);
    this.socketGateway.emitToAll(NotificationType.REMOVE_PROJECT, {
      payload: removedProject,
      socketId,
    });

    console.log(removedProject)
    
    return removedProject;
  }

  @Get('members')
  @UseGuards(AccessTokenGuard)
  searchMembers(@Query('searchText') searchText: string, @Req() req) {
    return this.projectService.searchMembers(searchText, req.user.sub);
  }

  @Get('own-projects/:status')
  @UseGuards(AccessTokenGuard)
  getOwnProjects(@Req() req, @Param('status') status: StatusProject) {
    return this.projectService.getOwnProjects(req.user.sub, status);
  }

  @Get('own-project-count')
  @UseGuards(AccessTokenGuard)
  geOwnProjectCountsByStatus(@Req() req) {
    return this.projectService.geOwnProjectCountsByStatus(req.user.sub);
  }

  @Get('foreign-projects/:status')
  @UseGuards(AccessTokenGuard)
  getForeignProjects(@Req() req, @Param('status') status: StatusProject) {
    return this.projectService.getForeignProjects(req.user.sub, status);
  }

  @Get('foreign-project-count')
  @UseGuards(AccessTokenGuard)
  geForeignProjectCountsByStatus(@Req() req) {
    return this.projectService.geForeignProjectCountsByStatus(req.user.sub);
  }
}
