import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { StatusProject } from '../types';
import { Task } from 'src/task/entities/task.entity';
import { Member } from 'src/user/entities/member.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StatusProject,
    array: false,
    default: StatusProject.IN_PROGRESS,
  })
  status: StatusProject;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.ownedProjects)
  owner: User;

  @OneToMany(() => Member, (member) => member.project, { cascade: true })
  members: Member[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
