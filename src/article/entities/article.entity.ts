import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Media } from '../../media/entities/media.entity';
import { ArticleHistory } from '../../article-history/entities/article-history.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'jsonb', default: [] })
  content!: any[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date;

  @Column({ type: 'simple-array', nullable: true })
  categories!: string[];

  @Column({ type: 'jsonb', nullable: true })
  sections!: any[];

  @Column({ type: 'simple-array', nullable: true })
  references!: string[];

  @Column({ default: false })
  isApproved!: boolean;

  @OneToMany(() => ArticleHistory, (history) => history.article)
  history!: ArticleHistory[];

  @OneToMany(() => Media, (media) => media.article, { cascade: true })
  media!: Media[];

  @ManyToMany(() => User, (user) => user.articles)
  @JoinTable()
  contributors!: User[];
}
