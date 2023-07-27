import { Project } from 'src/project/entities/project.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  task: string;

  @Column('boolean', { default: false })
  completed: boolean;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
