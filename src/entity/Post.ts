import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn 
} from "typeorm";


@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'int', nullable: true })
  isPublished: boolean;
}
