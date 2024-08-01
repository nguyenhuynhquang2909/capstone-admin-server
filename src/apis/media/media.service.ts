import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../common/entities/media.entity';
import { s3 } from '../../configs/aws.config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,
  ) {}

  private async getSchoolIdForUser(userId: number): Promise<number> {
    const schoolAdmin = await this.schoolAdminRepository.findOne({
      where: { user_id: userId },
    });
    if (!schoolAdmin) {
      throw new NotFoundException('School not found for this user');
    }
    return schoolAdmin.school_id;
  }

  async uploadMedia(
    files: Express.Multer.File[],
    userId: number,
  ): Promise<Media[]> {
    const schoolId = await this.getSchoolIdForUser(userId);

    const mediaList: Media[] = [];

    for (const file of files) {
      const fileName = `${uuidv4()}-${file.originalname}`;
      const filePath = `schools/${schoolId}/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      const newMedia = this.mediaRepository.create({
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`,
        media_type: file.mimetype,
        school_id: schoolId,
      });

      await this.mediaRepository.save(newMedia);
      mediaList.push(newMedia);
    }

    return mediaList;
  }
}
