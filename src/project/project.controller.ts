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
@UseGuards(AccessTokenGuard)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Post('create')
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
  async updateProject(
    @Req() req,
    @Param('id') id: string,
    @Headers('socketId') socketId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const updatedProject = await this.projectService.updateProject(req.user.sub, +id, updateProjectDto);
    this.socketGateway.emitToAll(NotificationType.UPDATE_PROJECT, { payload: updatedProject, socketId });
    return updatedProject;
  }

  @Patch('update-status-proj/:id')
  async updateProjectStatus(
    @Req() req,
    @Param('id') id: string,
    @Headers('socketId') socketId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const updatedProject = await this.projectService.updateProject(req.user.sub, +id, updateProjectDto);
    this.socketGateway.emitToAll(NotificationType.UPDATE_PROJECT_STATUS, {
      payload: updatedProject,
      socketId,
    });
    return updatedProject;
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string, @Headers('socketId') socketId: string) {
    const removedProject = await this.projectService.removeProject(+id, +req.user.sub);
    this.socketGateway.emitToAll(NotificationType.REMOVE_PROJECT, {
      payload: removedProject,
      socketId,
    });
    return removedProject;
  }

  @Get('own-projects/:status')
  getOwnProjects(
    @Req() req,
    @Param('status') status: StatusProject,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.projectService.getOwnProjects(req.user.sub, status, +page, +pageSize);
  }

  @Get('foreign-projects/:status')
  getForeignProjects(
    @Req() req,
    @Param('status') status: StatusProject,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.projectService.getForeignProjects(req.user.sub, status, +page, +pageSize);
  }

  @Get('own-project-count')
  async geOwnProjectCountsByStatus(@Req() req) {
    return this.projectService.geOwnProjectCountsByStatus(req.user.sub);
  }

  @Get('foreign/project/count')
  async geForeignProjectCountsByStatus(@Req() req) {
    return this.projectService.geForeignProjectCountsByStatus(req.user.sub);
  }

  @Get('search-own-projects/:status')
  searchOwnProjects(
    @Param('status') status: StatusProject,
    @Query('searchText') searchText: string,
    @Req() req,
  ) {
    return this.projectService.searchOwnProjects(searchText, req.user.sub, status);
  }

  @Get('search-foreign-projects/:status')
  searchForeignProjects(
    @Param('status') status: StatusProject,
    @Query('searchText') searchText: string,
    @Req() req,
  ) {
    return this.projectService.searchForeignProjects(searchText, req.user.sub, status);
  }

  @Get('users')
  searchUsers(@Query('searchText') searchText: string, @Req() req) {
    return this.projectService.searchUsers(searchText, req.user.sub);
  }
}
