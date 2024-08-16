import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EatingSchedule } from 'src/common/entities/eating-schedule.entity';
import { MealMedia } from 'src/common/entities/meal-media.entity';
import { Media } from 'src/common/entities/media.entity';
import { Repository } from 'typeorm';
import { MediaService } from '../media/media.service';
import { CreateEatingScheduleDto } from './dto/create-eating-schedule.dto';

@Injectable()
export class EatingScheduleService {
    constructor(
        @InjectRepository(EatingSchedule)
        private readonly eatingScheduleRepository: Repository<EatingSchedule>,
        @InjectRepository(MealMedia)
        private readonly mealMediaRepository: Repository<MealMedia>,
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
        private readonly mediaService: MediaService

    ) {}
    async createEatingSchedule(
        createEatingScheduleDto: CreateEatingScheduleDto,
        userId: number,
    ): Promise<EatingSchedule> {
        const {class_id,start_time, end_time, meal, menu, nutrition,location_id} = createEatingScheduleDto;
        const eatingSchedule = this.eatingScheduleRepository.create({
            class_id,
            start_time,
            end_time,
            meal,
            menu,
            nutrition,
            location_id
        });
        return await this.eatingScheduleRepository.save(eatingSchedule);
    }
    async associateMediaWithEatingSchedule(eatingScheduleId: number, mediaId: number) {
        const mediaExists = await this.mediaRepository.findOne({
            where: {id: mediaId},
        });
        if (!mediaExists) {
            throw new NotFoundException('Media not found');
        }
        await this.mediaRepository.query(
            'INSERT INTO meal_media (meal_id, media_id) VALUES ($1, $2)',
            [eatingScheduleId, mediaId]
        );
        
    }

}
