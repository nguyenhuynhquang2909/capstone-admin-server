import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'src/common/entities/subject.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
    constructor(
        @InjectRepository(Subject)
        private readonly subjectRepository: Repository<Subject>
    ) {}
    async getAllSubjects(): Promise<Subject[]> {
        const subjects = await this.subjectRepository.find();
        return subjects;
    }
}
