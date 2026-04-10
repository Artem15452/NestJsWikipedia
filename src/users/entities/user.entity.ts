import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { UserRole } from '../enum/UserRole';
import { IsArray, IsOptional } from 'class-validator';
import { Media } from '../../media/entities/media.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') 
id: string;
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
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
