import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { School } from './school.entity';

@Entity('school_admins')
export class SchoolAdmin {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  schoolId: number;

  @ManyToOne(() => User, (user) => user.schoolAdmins)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => School, (school) => school.schoolAdmins)
  @JoinColumn({ name: 'school_id' })
  school: School;
}
