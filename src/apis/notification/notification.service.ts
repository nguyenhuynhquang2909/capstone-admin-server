import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushNotificationService } from '../../common/services/push-notification.service';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { Student } from '../../common/entities/student.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from '../../common/entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async sendNotificationToSchoolParents(
    adminId: number,
    createNotificationDto: CreateNotificationDto,
  ): Promise<void> {
    const schoolAdmin = await this.schoolAdminRepository.findOne({
      where: { user_id: adminId },
    });

    if (!schoolAdmin) {
      throw new NotFoundException('Admin is not associated with any school');
    }

    const schoolId = schoolAdmin.school_id;

    const parents = await this.studentRepository
      .createQueryBuilder('student')
      .select('DISTINCT student.parent_id')
      .where('student.school_id = :schoolId', { schoolId })
      .getRawMany();

    const parentIds = parents.map((parent) => parent.parent_id);

    if (parentIds.length > 0) {
      await this.pushNotificationService.sendNotification(parentIds, {
        title: createNotificationDto.title,
        body: createNotificationDto.message,
        navigationId: 'notification',
        additionalData: createNotificationDto.additionalData,
      });

      // Save notification to the database
      const notifications = parentIds.map((parentId) => {
        const notification = new Notification();
        notification.user_id = parentId; // Assuming parentId corresponds to the user_id
        notification.title = createNotificationDto.title;
        notification.message = createNotificationDto.message;
        notification.status = 'unread'; // Default status
        notification.school_id = schoolAdmin.school_id;
        notification.notification_type = 'notification'; // Ensure type is validated
        return notification;
      });

      await this.notificationRepository.save(notifications);
    }
  }

  async getNotificationsForUser(adminId: number): Promise<Notification[]> {
    const schoolAdmin = await this.schoolAdminRepository.findOne({
      where: { user_id: adminId },
    });

    return this.notificationRepository.find({
      where: { school_id: schoolAdmin.school_id },
      order: { created_at: 'DESC' },
    });
  }
}
