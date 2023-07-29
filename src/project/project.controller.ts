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
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { StatusProject } from './types';
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectService.create(+req.user.sub, createProjectDto);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.updateProject(+id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
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

  @Get('project-count')
  @UseGuards(AccessTokenGuard)
  getProjectCountsByStatus(@Req() req) {
    return this.projectService.getProjectCountsByStatus(req.user.sub);
  }
}
