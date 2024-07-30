import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { School } from './school.entity';

@Entity({ name: 'school_admins' })
export class SchoolAdmin {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  school_id: number;

  @ManyToOne(() => User, (user) => user.school_admins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => School, (school) => school.school_admins, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'school_id' })
  school: School;
}
