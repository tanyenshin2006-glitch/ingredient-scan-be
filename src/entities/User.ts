import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column('text', { array: true, default: [] })
  allergies: string[];

  @Column('text', { array: true, default: [] })
  dietary_preferences: string[];

  @CreateDateColumn()
  created_at: Date;
}