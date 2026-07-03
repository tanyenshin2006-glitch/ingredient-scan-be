import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

    @Column({ type: "vector", length: 768 })
    embedding: number[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}