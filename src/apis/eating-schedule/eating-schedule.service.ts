import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EatingSchedule } from 'src/common/entities/eating-schedule.entity';
import { MealMedia } from 'src/common/entities/meal-media.entity';
import { Media } from 'src/common/entities/media.entity';
import { Repository } from 'typeorm';
import { MediaService } from '../media/media.service';
import { CreateEatingScheduleDto } from './dto/create-eating-schedule.dto';
import { UpdateEatingScheduleDto } from './dto/update-eating-schedule.dto';

@Injectable()
export class EatingScheduleService {
  constructor(
    @InjectRepository(EatingSchedule)
    private readonly eatingScheduleRepository: Repository<EatingSchedule>,
    @InjectRepository(MealMedia)
    private readonly mediaRepository: Repository<Media>,
    private readonly mediaService: MediaService,
  ) {}
  async createEatingSchedule(
    createEatingScheduleDto: CreateEatingScheduleDto,
  ): Promise<EatingSchedule> {
    const {
      class_id,
      start_time,
      end_time,
      meal,
      menu,
      nutrition,
      location_id,
    } = createEatingScheduleDto;
    const eatingSchedule = this.eatingScheduleRepository.create({
      class_id,
      start_time,
      end_time,
      meal,
      menu,
      nutrition,
      location_id,
    });
    return await this.eatingScheduleRepository.save(eatingSchedule);
  }
  async associateMediaWithEatingSchedule(
    eatingScheduleId: number,
    mediaId: number,
  ) {
    const mediaResult = await this.eatingScheduleRepository.query(
      `SELECT * FROM media WHERE id = $1`, 
      [mediaId]
    );

    if (mediaResult.length === 0) {
      throw new NotFoundException('Media not found');
    }
  
    await this.mediaRepository.query(
      'INSERT INTO meal_media (meal_id, media_id) VALUES ($1, $2)',
      [eatingScheduleId, mediaId],
    );
  }
  

  async getEatingSchedulesForWeek(classId: number): Promise<any> {
    const sql = `
            SELECT 
                es.*, 
                mm.media_id, 
                m.url as media_url,
                c.name as class_name,
                l.name as location_name
            FROM 
                eating_schedules es
            LEFT JOIN 
                meal_media mm ON mm.meal_id = es.id
            LEFT JOIN 
                media m ON m.id = mm.media_id
            LEFT JOIN
                classes c ON c.id = es.class_id
            LEFT JOIN
                locations l ON l.id = es.location_id
            WHERE 
                es.class_id = $1
            ORDER BY 
                es.start_time ASC
        `;

    const schedules = await this.eatingScheduleRepository.query(sql, [classId]);

    return this.groupSchedulesByDayAndMeal(schedules);
  }

  private groupSchedulesByDayAndMeal(schedules: any[]) {
    const grouped = {};

    schedules.forEach((schedule) => {
      const day = new Date(schedule.start_time).toISOString().slice(0, 10); // Get date part only
      const meal = schedule.meal; // Breakfast, Lunch, Afternoon

      if (!grouped[day]) {
        grouped[day] = {};
      }

      if (!grouped[day][meal]) {
        grouped[day][meal] = [];
      }
      const { media_url, ...restOfSchedule } = schedule;

      grouped[day][meal].push({
        ...restOfSchedule,
        menu: schedule.menu,
        nutrition: schedule.nutrition,
        media: schedule.media_url ? [schedule.media_url] : [],
      });
    });

    return grouped;
  }
  async updateEatingSchedule(
    eatingScheduleId: number,
    updateEatingScheduleDto: UpdateEatingScheduleDto,
    newFiles: Express.Multer.File[],
    userId: number,
  ): Promise<any> {
    const sql = `
            SELECT 
                es.*, 
                mm.media_id, 
                m.url as media_url
            FROM 
                eating_schedules es
            LEFT JOIN 
                meal_media mm ON mm.meal_id = es.id
            LEFT JOIN 
                media m ON m.id = mm.media_id
            WHERE 
                es.id = $1
        `;
    const existingSchedules = await this.eatingScheduleRepository.query(sql, [
      eatingScheduleId,
    ]);
    if (existingSchedules.length === 0) {
      throw new NotFoundException('Eating schedule not found');
    }
    const existingSchedule = existingSchedules[0];

    // Update only the provided fields, keep the old values for the others
    const updatedClassId =
      updateEatingScheduleDto.class_id ?? existingSchedule.class_id;
    const updatedStartTime =
      updateEatingScheduleDto.start_time ?? existingSchedule.start_time;
    const updatedEndTime =
      updateEatingScheduleDto.end_time ?? existingSchedule.end_time;
    const updatedMeal = updateEatingScheduleDto.meal ?? existingSchedule.meal;
    const updatedMenu = updateEatingScheduleDto.menu ?? existingSchedule.menu;
    const updatedNutrition =
      updateEatingScheduleDto.nutrition ?? existingSchedule.nutrition;
    const updatedLocationId =
      updateEatingScheduleDto.location_id ?? existingSchedule.location_id;

    const updateSql = `
            UPDATE eating_schedules
            SET 
                class_id = $2,
                start_time = $3,
                end_time = $4,
                meal = $5,
                menu = $6,
                nutrition = $7,
                location_id = $8,
                updated_at = NOW()
            WHERE id = $1;
        `;

    await this.eatingScheduleRepository.query(updateSql, [
      eatingScheduleId,
      updatedClassId,
      updatedStartTime,
      updatedEndTime,
      updatedMeal,
      updatedMenu,
      updatedNutrition,
      updatedLocationId,
    ]);

    // Delete old media if necessary
    const oldMediaIds = existingSchedules
      .map((schedule) => schedule.media_id)
      .filter(Boolean);
    if (oldMediaIds.length > 0) {
      const deleteMealMediaSql = `
                DELETE FROM meal_media WHERE meal_id = $1
            `;
      await this.eatingScheduleRepository.query(deleteMealMediaSql, [
        eatingScheduleId,
      ]);
      const deleteMediaSql = `
                DELETE FROM media WHERE id = ANY($1)
            `;
      await this.eatingScheduleRepository.query(deleteMediaSql, [oldMediaIds]);
    }

    // Upload and associate new media
    if (newFiles && newFiles.length > 0) {
      const uploadedMedia = await this.mediaService.uploadMedia(
        newFiles,
        userId,
      );
      for (const media of uploadedMedia) {
        const insertMealMediaSql = `
                INSERT INTO meal_media (meal_id, media_id) VALUES ($1, $2)
               `;
        await this.eatingScheduleRepository.query(insertMealMediaSql, [
          eatingScheduleId,
          media.id,
        ]);
        Logger.log(
          `Associated Media ID: ${media.id} with Eating Schedule ID: ${eatingScheduleId}`,
        );
      }
    }

    // Fetch the updated schedule with associated media
    const newSql = `
            SELECT 
                es.id, 
                es.class_id, 
                es.start_time, 
                es.end_time, 
                es.meal, 
                es.menu, 
                es.nutrition, 
                es.location_id, 
                es.created_at, 
                es.updated_at, 
                mm.media_id, 
                m.url AS media_url
            FROM 
                eating_schedules es
            LEFT JOIN 
                meal_media mm ON mm.meal_id = es.id
            LEFT JOIN 
                media m ON m.id = mm.media_id
            WHERE 
                es.id = $1
            ORDER BY 
                es.start_time ASC
        `;

    const updatedSchedule = await this.eatingScheduleRepository.query(newSql, [
      eatingScheduleId,
    ]);

    return this.formatScheduleWithMedia(updatedSchedule);
  }
  private formatScheduleWithMedia(schedules: any[]) {
    return schedules.map((schedule) => {
      const { media_url, ...restOfSchedule } = schedule;
      return {
        ...restOfSchedule,
        media: media_url ? [media_url] : [],
      };
    });
  }

  async deleteEatingSchedule(eatingScheduleId: number): Promise<void> {
    const sql = `
            SELECT 
                es.id as eating_schedule_id,
                mm.media_id,
                m.url as media_url
            FROM 
                eating_schedules es
            LEFT JOIN 
                meal_media mm ON mm.meal_id = es.id
            LEFT JOIN 
                media m ON m.id = mm.media_id
            WHERE 
                es.id = $1
        `;

    const eatingScheduleRecords = await this.eatingScheduleRepository.query(
      sql,
      [eatingScheduleId],
    );

    if (eatingScheduleRecords.length === 0) {
      throw new NotFoundException('Eating schedule not found');
    }

    for (const record of eatingScheduleRecords) {
      if (record.media_id) {
        await this.mediaService.deleteMedia(record.media_id);
      }
    }

    // Finally, delete the eating schedule
    await this.eatingScheduleRepository.delete(eatingScheduleId);
  }
}
