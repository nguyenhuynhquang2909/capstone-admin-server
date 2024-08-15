import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MediaService } from '../media/media.service';

// DTOs
import { CreatePostDto } from './dto/create-post.dto';

// Services
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from 'src/configs/aws.config';
import { PushNotificationService } from '../../common/services/push-notification.service';

// Entities
import { Comment } from 'src/common/entities/comment.entity';
import { ToggleLike } from 'src/common/entities/toggle-like.entity';
import { PostHashtag } from 'src/common/entities/post-hashtag.entity';
import { PostClass } from 'src/common/entities/post-class.entity';
import { ClassStudent } from 'src/common/entities/class-student.entity';
import { Post } from '../../common/entities/post.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { Student } from '../../common/entities/student.entity';
import { Media } from 'src/common/entities/media.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(ToggleLike)
    private readonly toggleLikeRepository: Repository<ToggleLike>,
    @InjectRepository(PostHashtag)
    private readonly postHashtagRepository: Repository<PostHashtag>,
    @InjectRepository(PostClass)
    private readonly postClassRepository: Repository<PostClass>,
    private readonly mediaService: MediaService,
    private readonly pushNotificationService: PushNotificationService,
    private readonly dataSource: DataSource,
  ) {}

  public async getSchoolIdForUser(userId: number): Promise<number> {
    const schoolAdmin = await this.schoolAdminRepository.findOne({
      where: { user_id: userId },
    });

    if (!schoolAdmin) {
      throw new NotFoundException('School not found for this user');
    }

    return schoolAdmin.school_id;
  }

  async getPostsBySchoolId(schoolId: number): Promise<any[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.post_media', 'post_media')
      .leftJoinAndSelect('post_media.media', 'media')
      .leftJoinAndSelect('post.post_hashtags', 'post_hashtags')
      .leftJoinAndMapMany('post.comments', 'post.comments', 'comments')
      .leftJoinAndMapMany(
        'post.toggle_likes',
        'post.toggle_likes',
        'toggle_likes',
      )
      .where('post.school_id = :schoolId', { schoolId })
      .loadRelationCountAndMap('post.numComments', 'post.comments')
      .loadRelationCountAndMap('post.numLikes', 'post.toggle_likes')
      .getMany();

    // Transform the response to a cleaner format
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      school_id: post.school_id,
      created_by: post.created_by,
      status: post.status,
      published_at: post.published_at,
      created_at: post.created_at,
      updated_at: post.updated_at,
      media: post.post_media.map((pm) => ({
        id: pm.media.id,
        url: pm.media.url,
        media_type: pm.media.media_type,
        created_at: pm.media.created_at,
      })),
      hashtags: post.post_hashtags.map((ph) => ph.hashtag),
      numComments: post['numComments'],
      numLikes: post['numLikes'],
    }));
  }

  async createDraft(createPostDto: CreatePostDto, userId: number) {
    const { title, content, classIds } = createPostDto;
  
    const schoolId = await this.getSchoolIdForUser(userId);
  
    const newPost = this.postRepository.create({
      title,
      content,
      status: 'draft',
      created_by: userId,
      school_id: schoolId,
    });
  
    await this.postRepository.save(newPost);
  
    if (classIds && classIds.length > 0) {
      for (const classId of classIds) {
        await this.postClassRepository.save({
          post_id: newPost.id,
          class_id: classId,
        });
      }
    }
  
    return newPost;
  }

  async updatePost(
    postId: number,
    updatePostDto: CreatePostDto,
    newFiles: Express.Multer.File[],
    userId: number,
  ) {
    const { title, content, status, classIds } = updatePostDto;
  
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['post_media', 'post_media.media', 'post_classes'],
    });
  
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  
    if (post.status === 'published' && status === 'draft') {
      throw new ForbiddenException(
        'Published posts cannot be reverted to drafts',
      );
    }
  
    const updatedTitle = title !== undefined ? title : post.title;
    const updatedContent = content !== undefined ? content : post.content;
    const updatedStatus = status !== undefined ? status : post.status;
  
    await this.dataSource.query(
      `UPDATE posts SET title = $1, content = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
      [updatedTitle, updatedContent, updatedStatus, postId],
    );
  
    if (updatedStatus === 'published') {
      await this.dataSource.query(
        `UPDATE posts SET published_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [postId],
      );
    } else if (updatedStatus === 'draft') {
      await this.dataSource.query(
        `UPDATE posts SET published_at = NULL WHERE id = $1`,
        [postId],
      );
    }
  
    if (newFiles && newFiles.length > 0) {
      await this.dataSource.transaction(async (manager) => {
        const mediaIds = post.post_media.map((pm) => pm.media.id);
        if (mediaIds.length > 0) {
          await manager.query(`DELETE FROM post_media WHERE post_id = $1`, [
            postId,
          ]);
          await manager.query(`DELETE FROM media WHERE id = ANY($1::int[])`, [
            mediaIds,
          ]);
        }
  
        for (const file of newFiles) {
          const fileName = `${uuidv4()}-${file.originalname}`;
          const filePath = `schools/${userId}/${fileName}`;
          const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;
  
          const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filePath,
            Body: file.buffer,
            ContentType: file.mimetype,
          });
          await s3.send(command);
  
          const mediaInsertResult = await manager.query(
            `INSERT INTO media (url, media_type, school_id, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id`,
            [fileUrl, file.mimetype, userId],
          );
          const newMediaId = mediaInsertResult[0].id;
  
          await manager.query(
            `INSERT INTO post_media (post_id, media_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)`,
            [postId, newMediaId],
          );
        }
      });
    }
  
    if (classIds && classIds.length > 0) {
      // Clear existing class associations
      await this.postClassRepository.delete({ post_id: postId });
  
      // Insert new class associations
      for (const classId of classIds) {
        await this.postClassRepository.save({
          post_id: postId,
          class_id: classId,
        });
      }
    }
  
    return await this.dataSource.query(`SELECT * FROM posts WHERE id = $1`, [
      postId,
    ]);
  }

  private async notifyParentsOfNewPost(post: Post) {
    // Retrieve all class IDs associated with the post from the junction table
    const postClasses = await this.postClassRepository
      .createQueryBuilder('postClass')
      .select('postClass.class_id')
      .where('postClass.post_id = :postId', { postId: post.id })
      .getMany();
  
    if (postClasses.length === 0) {
      console.log(
        `No classes associated with post (ID: ${post.id}). Skipping notification.`,
      );
      return;
    }
  
    const classIds = postClasses.map((pc) => pc.class_id);
  
    // Fetch students associated with the class IDs
    const studentRecords = await this.dataSource
      .createQueryBuilder()
      .select('classStudent.student_id')
      .from(ClassStudent, 'classStudent')
      .where('classStudent.class_id IN (:...classIds)', { classIds })
      .getRawMany();
  
    const studentIds = studentRecords.map(record => record.classStudent_student_id);
  
    if (studentIds.length === 0) {
      console.log(`No students found for classes (IDs: ${classIds.join(', ')}). Skipping notification.`);
      return;
    }
  
    const uniqueStudentIds = Array.from(new Set(studentIds));
  
    // Fetch parent IDs associated with the student IDs
    const parentRecords = await this.dataSource
      .createQueryBuilder()
      .select('student.parent_id')
      .from(Student, 'student')
      .where('student.id IN (:...studentIds)', { studentIds: uniqueStudentIds })
      .getRawMany();
  
    // Correctly map parent IDs
    const parentIds = parentRecords.map(record => record.student_parent_id);
  
    const uniqueParentIdsArray = Array.from(new Set(parentIds));
  
    if (uniqueParentIdsArray.length > 0) {
      await this.pushNotificationService.sendNotification(
        uniqueParentIdsArray,
        {
          title: `New Post: ${post.title}`,
          body: `A new post has been published in your child's class.`,
          navigationId: 'post',
          additionalData: { postId: post.id },
        },
      );
    } else {
      console.log(`No parents to notify for post (ID: ${post.id}).`);
    }
  }

  async publishPost(postId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.status === 'published') {
      throw new ForbiddenException('Post is already published');
    }

    post.status = 'published';
    post.published_at = new Date();

    await this.postRepository.save(post);

    await this.notifyParentsOfNewPost(post);

    return post;
  }

  async associateMediaWithPost(postId: number, mediaId: number) {
    const mediaExists = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!mediaExists) {
      throw new NotFoundException('Media not found');
    }
    await this.mediaRepository.query(
      'INSERT INTO post_media (post_id, media_id) VALUES ($1, $2)',
      [postId, mediaId],
    );
  }

  async deletePost(postId: number): Promise<void> {
    const post = await this.postRepository.findOneOrFail({
      where: { id: postId },
      relations: [
        'post_media',
        'post_media.media',
        'comments',
        'toggle_likes',
        'post_hashtags',
        'post_classes',
      ],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Delete related media from S3 and database
    for (const postMedia of post.post_media) {
      const media = postMedia.media;
      if (media) {
        await this.mediaService.deleteMedia(media.id);
      }
    }

    // Delete comments, likes, hashtags, and classes
    await this.commentRepository.delete({ post });
    await this.toggleLikeRepository.delete({ post });
    await this.postHashtagRepository.delete({ post });
    await this.postClassRepository.delete({ post });

    // Delete post
    await this.postRepository.delete(post.id);
  }
}
