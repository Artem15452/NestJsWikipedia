import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('article_history')
export class ArticleHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Article, (article) => article.history, { onDelete: 'CASCADE' })
  article!: Article;

  @Column({ type: 'jsonb', nullable: true })
  contentBefore!: any;

  @Column({ type: 'jsonb', nullable: true })
  contentAfter!: any;

  @Column({ nullable: true })
  titleBefore!: string;

  @Column({ nullable: true })
  titleAfter!: string;

  @ManyToOne(() => User, { nullable: true })
  redactedBy?: User | null;

  @CreateDateColumn()
  dataRedaction!: Date;
}
