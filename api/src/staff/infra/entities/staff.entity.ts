import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  position: string;
  //직책 
  @Column({ length: 13 })
  phone: string;

  @Column({ length: 100 })
  email: string;

  @Column({length:50})
  role:string
  // 팀내 업무 
  @Column({length:30})
  team:string
  // 소속 팀 
}

