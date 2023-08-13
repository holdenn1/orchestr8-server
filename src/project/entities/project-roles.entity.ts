import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { UserRole } from 'src/user/types/enum.user-role';

@Entity()
export class ProjectUserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.projectRoles)
  user: User;

  @ManyToOne(() => Project, (project) => project.projectRoles)
  project: Project;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;
}
