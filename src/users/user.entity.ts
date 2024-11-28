import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Nome da tabela no banco de dados
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
