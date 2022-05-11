import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column 
} from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  timeOfRegister: string

  @Column({ nullable: true })
  isSuperUser: boolean;
  
  @Column({ nullable: true })
  role: string;
}

@Entity()
export class UserLogin {
  id: number;
  email: string;
  password: string;
  session: string;
  views: any;
}
