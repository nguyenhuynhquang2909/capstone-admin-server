import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../common/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { Media } from 'src/common/entities/media.entity';
import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from 'src/configs/aws.config';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  public async getSchoolIdForUser(userId: number): Promise<number> {
    const schoolAdmin = await this.schoolAdminRepository.findOne({ where: { user_id: userId } });
    
    if (!schoolAdmin) {
      throw new NotFoundException('School not found for this user');
    }

    return schoolAdmin.school_id;
  }

  async getPostsBySchoolId(schoolId: number): Promise<any[]> {
    const posts = await this.postRepository.find({
      where: { school_id: schoolId },
      relations: ['post_media', 'post_media.media'],  // Load related media
    });

    // Transform the response to a cleaner format
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      school_id: post.school_id,
      created_by: post.created_by,
      status: post.status,
      published_at: post.published_at,
      created_at: post.created_at,
      updated_at: post.updated_at,
      media: post.post_media.map(pm => ({
        id: pm.media.id,
        url: pm.media.url,
        media_type: pm.media.media_type,
        created_at: pm.media.created_at,
      })),
    }));
  }

  async createDraft(createPostDto: CreatePostDto, userId: number) {
    const { title, content } = createPostDto;
    
    const schoolId = await this.getSchoolIdForUser(userId);

    const newPost = this.postRepository.create({
      title,
      content,
      status: 'draft',
      created_by: userId,
      school_id: schoolId,
    });

    await this.postRepository.save(newPost);
    return newPost;
  }

  async updatePost(postId: number, updatePostDto: Partial<CreatePostDto>) {
    const { title, content, status } = updatePostDto;

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.status === 'published' && status === 'draft') {
      throw new ForbiddenException('Published posts cannot be reverted to drafts');
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (status !== undefined) {
      if (post.status === 'published') {
        throw new ForbiddenException('Published posts cannot have their status changed');
      }
      post.status = status;
      if (status === 'published') {
        post.published_at = new Date();
      } else if (status === 'draft') {
        post.published_at = null;
      }
    }

    await this.postRepository.save(post);
    return post;
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
    return post;
  }
  async associateMediaWithPost(postId: number, mediaId: number) {
    await this.mediaRepository.query(
      "INSERT INTO post_media (post_id, media_id) VALUES ($1, $2)",
      [postId, mediaId]
    )
  }

//   async uploadMedia(files: Express.Multer.File[], userId: number): Promise<Media[]> {
//     const schoolId = await this.getSchoolIdForUser(userId);
    
//     const mediaList: Media[] = [];
    
//     for (const file of files) {
//       const fileName = `${uuidv4()}-${file.originalname}`;
//       const filePath = `schools/${schoolId}/${fileName}`;

//       const command = new PutObjectCommand({
//         Bucket: 'testing-mykids-bucket',
//         Key: filePath,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       });

//       await s3.send(command);

//       const newMedia = this.mediaRepository.create({
//         url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`,
//         media_type: file.mimetype,
//         school_id: schoolId,
//       });

//       await this.mediaRepository.save(newMedia);
//       mediaList.push(newMedia);
//     }

//     return mediaList;
//   }
// }
}


