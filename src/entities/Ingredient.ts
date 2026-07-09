import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category, Severity } from '../enums/ingredient.enums.js'

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', unique: true })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text' })
    safety_notes: string;

    @Column({ type: 'boolean', default: false })
    is_common_allergen: boolean;

    @Column({ type: 'enum', enum: Category })
    category: Category;

    @Column({ type: 'enum', enum: Severity })
    severity: Severity;

    @Column({ type: "vector", length: 1024 })
    embedding: number[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}