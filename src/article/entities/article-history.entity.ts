import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import {Article} from './article.entity';
import {User} from '../../users/entities/user.entity';

@Entity('article_history')
export class ArticleHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (article) => article.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;

  @ManyToOne(() => User, {nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'editor_id' })
  editor: User;

  @Column({ type : 'varchar', nullable: true})
  title: string;

  @Column({ type: 'jsonb', nullable: true })
  content: any[];

  @Column({ type: 'simple-array', nullable: true })
  categories: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  editedAt: Date;
}