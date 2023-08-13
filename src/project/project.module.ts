import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { UserModule } from 'src/user/user.module';
import { ProjectUserRole } from './entities/project-roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectUserRole]), UserModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}
