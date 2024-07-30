import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { Post } from '../../common/entities/post.entity';
import { ToggleLike } from '../../common/entities/toggle-like.entity';
import { Comment } from '../../common/entities/comment.entity';
import { Student } from '../../common/entities/student.entity';
import { PostClass } from '../../common/entities/post-class.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(ToggleLike)
    private readonly toggleLikeRepository: Repository<ToggleLike>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  private async getStudentClassIds(userId: number): Promise<number[]> {
    const students = await this.studentRepository.find({
      where: { parent_id: userId },
      relations: ['class_students'],
    });

    if (students.length === 0) {
      throw new NotFoundException('No students found for the user.');
    }

    const classIds = students.flatMap((student) =>
      student.class_students.map((classStudent) => classStudent.class_id),
    );

    return classIds;
  }

  async findPostsForUser(userId: number): Promise<Post[]> {
    const classIds = await this.getStudentClassIds(userId);

    if (classIds.length === 0) {
      throw new NotFoundException("No classes found for the user's students.");
    }

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin(PostClass, 'postClass', 'postClass.post_id = post.id')
      .where('postClass.class_id IN (:...classIds)', { classIds })
      .andWhere('post.status = :status', { status: 'published' })
      .getMany();

    if (posts.length === 0) {
      throw new NotFoundException('No published posts found for the user.');
    }

    return posts;
  }

  async findPostByIdForUser(userId: number, postId: number): Promise<Post> {
    const classIds = await this.getStudentClassIds(userId);

    if (classIds.length === 0) {
      throw new NotFoundException("No classes found for the user's students.");
    }

    const post = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin(PostClass, 'postClass', 'postClass.post_id = post.id')
      .where('post.id = :postId', { postId })
      .andWhere('postClass.class_id IN (:...classIds)', { classIds })
      .andWhere('post.status = :status', { status: 'published' })
      .getOne();

    if (!post) {
      throw new NotFoundException(
        'Published post not found or not accessible.',
      );
    }

    return post;
  }

  async toggleLikeForPost(userId: number, postId: number): Promise<string> {
    const classIds = await this.getStudentClassIds(userId);

    if (classIds.length === 0) {
      throw new NotFoundException("No classes found for the user's students.");
    }

    const post = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin(PostClass, 'postClass', 'postClass.post_id = post.id')
      .where('post.id = :postId', { postId })
      .andWhere('postClass.class_id IN (:...classIds)', { classIds })
      .andWhere('post.status = :status', { status: 'published' })
      .getOne();

    if (!post) {
      throw new ConflictException(
        "Post is not accessible or not associated with the user's students' classes.",
      );
    }

    const existingLike = await this.toggleLikeRepository.findOne({
      where: { user_id: userId, post_id: postId },
    });

    if (existingLike) {
      await this.toggleLikeRepository.delete({
        user_id: userId,
        post_id: postId,
      });
      return 'Like removed';
    } else {
      const newLike = this.toggleLikeRepository.create({
        user_id: userId,
        post_id: postId,
      });
      await this.toggleLikeRepository.save(newLike);
      return 'Like added';
    }
  }

  async addCommentToPost(
    userId: number,
    postId: number,
    content: string,
  ): Promise<Comment> {
    const classIds = await this.getStudentClassIds(userId);

    if (classIds.length === 0) {
      throw new NotFoundException("No classes found for the user's students.");
    }

    const post = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin(PostClass, 'postClass', 'postClass.post_id = post.id')
      .where('post.id = :postId', { postId })
      .andWhere('postClass.class_id IN (:...classIds)', { classIds })
      .andWhere('post.status = :status', { status: 'published' })
      .getOne();

    if (!post) {
      throw new ConflictException(
        "Post is not accessible or not associated with the user's students' classes.",
      );
    }

    const comment = this.commentRepository.create({
      content,
      post_id: postId,
      user_id: userId,
    });

    return this.commentRepository.save(comment);
  }

  async editComment(
    userId: number,
    commentId: number,
    content: string,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['post'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    const post = comment.post;

    const classIds = await this.getStudentClassIds(userId);

    if (classIds.length === 0) {
      throw new NotFoundException("No classes found for the user's students.");
    }

    const postExists = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin(PostClass, 'postClass', 'postClass.post_id = post.id')
      .where('post.id = :postId', { postId: post.id })
      .andWhere('postClass.class_id IN (:...classIds)', { classIds })
      .andWhere('post.status = :status', { status: 'published' })
      .getOne();

    if (!postExists) {
      throw new ConflictException(
        "Post is not accessible or not associated with the user's students' classes.",
      );
    }

    comment.content = content;
    return this.commentRepository.save(comment);
  }

  async deleteComment(userId: number, commentId: number): Promise<string> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['post'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    const post = comment.post;

    const classIds = await this.getStudentClassIds(userId);

    if (classIds.length === 0) {
      throw new NotFoundException("No classes found for the user's students.");
    }

    const postExists = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin(PostClass, 'postClass', 'postClass.post_id = post.id')
      .where('post.id = :postId', { postId: post.id })
      .andWhere('postClass.class_id IN (:...classIds)', { classIds })
      .andWhere('post.status = :status', { status: 'published' })
      .getOne();

    if (!postExists) {
      throw new ConflictException(
        "Post is not accessible or not associated with the user's students' classes.",
      );
    }

    await this.commentRepository.delete(commentId);
    return 'Comment deleted';
  }
}
