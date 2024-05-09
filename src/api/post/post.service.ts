import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../common/entities/post.entity';
import { ToggleLike } from '../../common/entities/toggle-like.entity';
import { AuthService } from '../../api/auth/auth.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly authService: AuthService,
    @InjectRepository(ToggleLike)
    private readonly toggleLikeRepository: Repository<ToggleLike>,
  ) {}

  private async mapPostWithLikes(post: Post): Promise<any> {
    const numLikes = post.likes.length;
    const likers = post.likes.map((like) => like.user_id.toString());

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
      likers,
    };
  }

  async findAll(userId: number): Promise<any[]> {
    // Get the user from the user ID
    const user = await this.authService.getProfile(userId);
    if (!user) {
      throw new NotFoundException(`Người dùng không tồn tại`);
    }

    // Retrieve the schools where the user's students are studying
    const schoolIds = user.students.map((student) => student.school_id);

    // Find all posts associated with the retrieved schools
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.school', 'school')
      .leftJoinAndSelect('post.likes', 'like')
      .where('school.id IN (:...schoolIds)', { schoolIds })
      .getMany();

    // Map posts to include number of likes and list of likers
    return Promise.all(posts.map((post) => this.mapPostWithLikes(post)));
  }

  async findOne(userId: number, id: number): Promise<any> {
    // Get the user from the user ID
    const user = await this.authService.getProfile(userId);
    if (!user) {
      throw new NotFoundException(`Người dùng không tồn tại`);
    }

    // Retrieve the schools where the user's students are studying
    const schoolIds = user.students.map((student) => student.school_id);

    // Find the post by ID and check if it belongs to one of the user's schools
    const post = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.school', 'school')
      .leftJoinAndSelect('post.likes', 'like')
      .where('post.id = :id', { id })
      .andWhere('school.id IN (:...schoolIds)', { schoolIds })
      .getOne();

    if (!post) {
      throw new NotFoundException(`Bài viết không tồn tại`);
    }

    // Map post to include number of likes and list of likers
    return this.mapPostWithLikes(post);
  }

  async toggleLike(
    userId: number,
    postId: number,
  ): Promise<{ status: string; message: string }> {
    // Retrieve the user's profile
    const user = await this.authService.getProfile(userId);
    if (!user) {
      throw new NotFoundException(`Người dùng không tồn tại`);
    }

    // Retrieve the schools where the user's students are studying
    const schoolIds = user.students.map((student) => student.school_id);

    // Find the post by ID and check if it belongs to one of the user's schools
    const post = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.school', 'school')
      .where('post.id = :postId', { postId })
      .andWhere('school.id IN (:...schoolIds)', { schoolIds })
      .getOne();

    if (!post) {
      throw new NotFoundException(
        `Bài viết không tồn tại hoặc không thuộc trường học của con em bạn`,
      );
    }

    // Check if the user has already liked the post
    const existingLike = await this.toggleLikeRepository.findOne({
      where: { user_id: userId, post_id: postId },
    });
    if (existingLike) {
      // Unlike the post if already liked
      await this.toggleLikeRepository.delete({
        user_id: userId,
        post_id: postId,
      });
      return { status: 'success', message: 'Bỏ thích bài viết thành công' };
    } else {
      // Like the post if not already liked
      await this.toggleLikeRepository.save({
        user_id: userId,
        post_id: postId,
      });
      return { status: 'success', message: 'Thích bài viết thành công' };
    }
  }
}
