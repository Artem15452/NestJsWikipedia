import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Media } from '../../media/entities/media.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'jsonb', nullable: true })
  content: { type: 'text' | 'header' | 'image'; value: string }[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'simple-array', nullable: true })
  categories: string[];

  @Column({ type: 'simple-array', nullable: true })
  references: string[];

  @Column({ default: false })
  isApproved: boolean;

  @OneToMany(() => Media, (media) => media.article, { cascade: true })
  media: Media[];

  @ManyToMany(() => User, (user) => user.articles)
  @JoinTable()
  contributors: User[];
}
