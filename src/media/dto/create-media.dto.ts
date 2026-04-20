import { Column } from 'typeorm';
export class CreateMediaDto {

  @Column()
  url: string;

  @Column()
  publicId: string;
  
  @Column()
  description: string;

  @Column()
  title: string;  
}
