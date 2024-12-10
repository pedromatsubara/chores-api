import { Exclude, Expose } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ nullable: false })
  @Expose()
  name: string;

  @Column({ unique: true, nullable: false })
  @Expose()
  email: string;

  @Column({ nullable: true })
  @Expose()
  address: string;

  @Column({ nullable: true })
  @Expose()
  phone: string;

  @Column({ nullable: true })
  @Expose()
  avatarUrl: string;

  @Column()
  @Exclude()
  password: string;
}
