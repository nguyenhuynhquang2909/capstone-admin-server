import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../common/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,
  ) {}

  private async getSchoolIdForUser(userId: number): Promise<number> {
    const schoolAdmin = await this.schoolAdminRepository.findOne({ where: { user_id: userId } });
    
    if (!schoolAdmin) {
      throw new NotFoundException('School not found for this user');
    }

    return schoolAdmin.school_id;
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
}
