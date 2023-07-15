import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserModule } from 'src/user/user.module';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task]), UserModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
