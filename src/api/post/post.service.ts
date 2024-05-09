import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../common/entities/post.entity';
import { ToggleLike } from '../../common/entities/toggle-like.entity';
import { Comment } from '../../common/entities/comment.entity';
import { AuthService } from '../../api/auth/auth.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly authService: AuthService,
    @InjectRepository(ToggleLike)
    private readonly toggleLikeRepository: Repository<ToggleLike>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private async getUserSchoolIds(userId: number): Promise<number[]> {
    const user = await this.authService.getProfile(userId);
    if (!user) {
      throw new NotFoundException(`Người dùng không tồn tại`);
    }
    return user.students.map((student) => Number(student.school_id));
  }

  private async findPostByIdAndCheckSchool(
    userId: number,
    postId: number,
  ): Promise<Post> {
    const schoolIds = await this.getUserSchoolIds(userId);
    const post = await this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.school', 'school')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('post.comments', 'comment')
      .where('post.id = :postId', { postId })
      .andWhere('school.id IN (:...schoolIds)', { schoolIds })
      .getOne();
    if (!post) {
      throw new NotFoundException(
        `Bài viết không tồn tại hoặc không thuộc trường học của con em bạn`,
      );
    }
    return post;
  }

  private mapPost(post: Post): any {
    if (!post) return null;

    const numLikes = post.likes ? post.likes.length : 0;
    const numComments = post.comments ? post.comments.length : 0;
    const likers = post.likes ? post.likes.map((like) => like.user_id.toString()) : [];

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      school_id: post.school_id,
      user_id: post.user_id,
      published_at: post.published_at,
      created_at: post.created_at,
      updated_at: post.updated_at,
      numLikes,
      numComments,
      likers,
    };
  }

  async findAll(userId: number): Promise<any[]> {
    const schoolIds = await this.getUserSchoolIds(userId);
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.school', 'school')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('post.comments', 'comment')
      .where('school.id IN (:...schoolIds)', { schoolIds })
      .getMany();
    return Promise.all(posts.map((post) => this.mapPost(post)));
  }

  async findOne(userId: number, id: number): Promise<any> {
    const post = await this.findPostByIdAndCheckSchool(userId, id);
    const mappedPost = this.mapPost(post);

    const comments = post.comments ? post.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      user_id: comment.user_id,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
    })) : [];

    const numComments = comments.length;

    return { post: { ...mappedPost, numComments }, comments };
  }

  async toggleLike(userId: number, postId: number): Promise<{ status: string; message: string }> {
    await this.findPostByIdAndCheckSchool(userId, postId);
    const existingLike = await this.toggleLikeRepository.findOne({
      where: { user_id: userId, post_id: postId },
    });
    if (existingLike) {
      await this.toggleLikeRepository.delete({ user_id: userId, post_id: postId });
      return { status: 'success', message: 'Bỏ thích bài viết thành công' };
    } else {
      await this.toggleLikeRepository.save({ user_id: userId, post_id: postId });
      return { status: 'success', message: 'Thích bài viết thành công' };
    }
  }

  async commentPost(userId: number, postId: number, content: string): Promise<any> {
    const post = await this.findPostByIdAndCheckSchool(userId, postId);
    const comment = new Comment();
    comment.content = content;
    comment.post = post;
    comment.user = await this.authService.getProfile(userId);
    await this.commentRepository.save(comment);
    return { status: 'success', message: 'Bình luận bài viết thành công' };
  }
}
