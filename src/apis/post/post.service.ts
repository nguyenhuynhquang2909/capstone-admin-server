import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../common/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { Media } from 'src/common/entities/media.entity';
import { v4 as uuidv4 } from 'uuid';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { s3 } from 'src/configs/aws.config';
import { Comment } from 'src/common/entities/comment.entity';
import { ToggleLike } from 'src/common/entities/toggle-like.entity';
import { PostHashtag } from 'src/common/entities/post-hashtag.entity';
import { PostClass } from 'src/common/entities/post-class.entity';

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
    private readonly postClassRepository: Repository<PostClass>

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

  async deletePost(postId: number): Promise<void> {
    const post = await this.postRepository.findOneOrFail({
      where: { id: postId },
      relations: ['post_media', 'post_media.media', 'comments', 'toggle_likes', 'post_hashtags', 'post_classes'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Delete related media from S3 and database
    for (const postMedia of post.post_media) {
      const media = postMedia.media;
      if (media) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: this.getS3KeyFromUrl(media.url),
        });
        await s3.send(deleteCommand);
        await this.mediaRepository.delete(media.id);
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

  private getS3KeyFromUrl(url: string): string {
      const urlParts = url.split('/');
      return urlParts.slice(3).join('/');
}

}
