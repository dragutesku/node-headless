import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn 
} from "typeorm";


@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column("text")
  content: string;

  @Column()
  isPublished: boolean;
}
