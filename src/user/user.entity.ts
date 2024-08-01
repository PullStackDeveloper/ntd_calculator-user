import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: 'active' })
  status: string;
}
