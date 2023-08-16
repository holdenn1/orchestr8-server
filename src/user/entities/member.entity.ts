import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { MemberRole } from '../types/enum.user-role';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.member, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Project, (project) => project.members, { onDelete: 'CASCADE' })
  project: Project;

  @Column({
    type: 'enum',
    enum: MemberRole,
  })
  role: MemberRole;
}
