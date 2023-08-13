import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { RefreshToken } from './refreshToken.entity';
import { ProjectUserRole } from 'src/project/entities/project-roles.entity';

@Entity({ name: 'app_user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  photo: string;

  @Column({unique: true})
  phone: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @OneToMany(() => ProjectUserRole, (projectUserRole) => projectUserRole.user)
  projectRoles: ProjectUserRole[];

  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  @ManyToMany(() => Project, (project) => project.members)
  @JoinTable()
  memberProjects: Project[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
