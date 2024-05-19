import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('device_tokens')
export class DeviceToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  token: string;

  @PrimaryColumn({ nullable: false })
  user_id: number;

  @ManyToOne(() => User, (user) => user.device_tokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255, nullable: false })
  device_type: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
