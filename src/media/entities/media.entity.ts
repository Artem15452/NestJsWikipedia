import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { IsOptional } from 'class-validator';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  publicId: string;

  @Column({ nullable: true })
  @IsOptional()
  description: string;

  @ManyToOne(() => Article, (article) => article.media, { onDelete: 'CASCADE' })
  article: Article,
  nullable: true 
}
