import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Absence } from 'src/common/entities/absence.entity';
import { CreateAbsenceDto } from './dto/create-absence.dto';


@Injectable()
export class AbsenceService {
    constructor(
        @InjectRepository(Absence)
        private absenceRepository: Repository<Absence>, 
    ) {}

    async findAllAbsences(parentId: number): Promise<Absence[]> {
        return this.absenceRepository
          .createQueryBuilder('absence')
          .innerJoinAndSelect('absence.student', 'student')
          .where('student.parent_id = :parent_id', { parent_id: parentId }) // use correct placeholder
          .getMany();
      }
    async createAbsence(createAbsenceDto: CreateAbsenceDto): Promise<Absence> {
        const absence = this.absenceRepository.create(createAbsenceDto);
        return this.absenceRepository.save(absence);
    }

}
