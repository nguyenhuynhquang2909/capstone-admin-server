import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'main_images' })
export class MainImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    url: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
}
