import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { UserRole } from '../enum/UserRole';
import { IsArray, IsOptional } from 'class-validator';
import { Media } from '../../media/entities/media.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Media, { cascade: true, nullable: true })
  @JoinColumn()
  avatar: Media;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @IsOptional()
  role: UserRole;

  @Column({ type: 'simple-json', nullable: true })
  @IsOptional()
  @IsArray()
  socialLinks: string[];

  @ManyToMany(() => Article, (article) => article.contributors)
  articles: Article[];
}
