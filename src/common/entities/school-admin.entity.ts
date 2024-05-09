import { Entity, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { School } from './school.entity';

@Entity('school_admins')
export class SchoolAdmin {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  school_id: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => School, (school) => school.id)
  @JoinColumn({ name: 'school_id' })
  school: School;
}
