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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AccessTokenGuard)
  @Post('create')
  @UsePipes(new ValidationPipe())
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    console.log(req);
    
    return this.projectService.create(+req.user.sub, createProjectDto);
  }

  @Get()
  find(){
    return this.projectService.find()
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
