import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  taskText: string;

  @Column('boolean', { default: false })
  completed: boolean;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
