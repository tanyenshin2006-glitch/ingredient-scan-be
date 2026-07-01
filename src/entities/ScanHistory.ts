import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class ScanHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column('text')
  ingredients_text: string;

  @Column('text', { array: true, default: [] })
  allergens: string[];

  @Column('text', { array: true, default: [] })
  warnings: string[];

  @CreateDateColumn()
  scanned_at: Date;
}