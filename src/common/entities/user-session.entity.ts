import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_sessions' })
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  access_token: string;

  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => User, (user) => user.user_sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamptz' })
  access_token_expiration_time: Date;

  @Column({ type: 'text', nullable: true })
  device_info: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
