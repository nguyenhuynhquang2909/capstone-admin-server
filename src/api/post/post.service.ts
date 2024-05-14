import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { S3Client, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { extname } from 'path';

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
private readonly configService: ConfigService  ) {}

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

  private async mapPost(post: Post): Promise<any> {
    if (!post) return null;

    const numLikes = post.likes ? post.likes.length : 0;
    const numComments = post.comments ? post.comments.length : 0;
    const likers = post.likes
      ? post.likes.map((like) => like.user_id.toString())
      : [];

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      school_id: post.school_id,
      school_name: post.school.name,
      created_by: post.created_by,
      published_at: post.published_at,
      created_at: post.created_at,
      updated_at: post.updated_at,
      status: post.status,
      numLikes,
      numComments,
      likers,
    };
  }

  async findAll(userId: number): Promise<any[]> {
    const schoolIds = await this.getUserSchoolIds(userId);
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.school', 'school')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('post.comments', 'comment')
      .where('school.id IN (:...schoolIds)', { schoolIds })
      .andWhere('post.status = :status', { status: 'published' })
      .getMany();
    return Promise.all(posts.map((post) => this.mapPost(post)));
  }

  async findOne(userId: number, id: number): Promise<any> {
    const post = await this.findPostByIdAndCheckSchool(userId, id);
    if (post.status !== 'published') {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    const mappedPost = await this.mapPost(post);

    const comments = post.comments
      ? post.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          user_id: comment.user_id,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
        }))
      : [];

    const numComments = comments.length;

    return { post: { ...mappedPost, numComments }, comments };
  }

  async toggleLike(
    userId: number,
    postId: number,
  ): Promise<{ status: string; message: string }> {
    const post = await this.findPostByIdAndCheckSchool(userId, postId);
    if (post.status !== 'published') {
      throw new UnauthorizedException('Bài viết không tồn tại');
    }
    const existingLike = await this.toggleLikeRepository.findOne({
      where: { user_id: userId, post_id: postId },
    });
    if (existingLike) {
      await this.toggleLikeRepository.delete({
        user_id: userId,
        post_id: postId,
      });
      return { status: 'success', message: 'Bỏ thích bài viết thành công' };
    } else {
      await this.toggleLikeRepository.save({
        user_id: userId,
        post_id: postId,
      });
      return { status: 'success', message: 'Thích bài viết thành công' };
    }
  }

  async commentPost(
    userId: number,
    postId: number,
    content: string,
  ): Promise<any> {
    const post = await this.findPostByIdAndCheckSchool(userId, postId);
    if (post.status !== 'published') {
      throw new UnauthorizedException('Bài viết không tồn tại');
    }
    const comment = new Comment();
    comment.content = content;
    comment.post = post;
    comment.user = await this.authService.getProfile(userId);
    await this.commentRepository.save(comment);
    return { status: 'success', message: 'Bình luận bài viết thành công' };
  }

  async deleteComment(
    userId: number,
    postId: number,
    commentId: number,
  ): Promise<any> {
    const post = await this.findPostByIdAndCheckSchool(userId, postId);
    if (post.status !== 'published') {
      throw new UnauthorizedException('Bài viết không tồn tại');
    }
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, post: { id: postId } },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException(`Không tìm thấy bình luận`);
    }
    if (comment.user.id !== userId) {
      throw new UnauthorizedException(`Bạn không có quyền xóa bình luận này`);
    }
    await this.commentRepository.remove(comment);
    return { status: 'success', message: 'Xóa bình luận thành công' };
  }

  async editComment(
    userId: number,
    postId: number,
    commentId: number,
    content: string,
  ): Promise<any> {
    const post = await this.findPostByIdAndCheckSchool(userId, postId);
    if (post.status !== 'published') {
      throw new UnauthorizedException('Bài viết không tồn tại');
    }
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, post: { id: postId } },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException(`Không tìm thấy bình luận`);
    }
    if (comment.user.id !== userId) {
      throw new UnauthorizedException(
        `Bạn không có quyền chỉnh sửa bình luận này`,
      );
    }
    comment.content = content;
    await this.commentRepository.save(comment);
    return { status: 'success', message: 'Chỉnh sửa bình luận thành công' };
  }

  async uploadImages(
    userId: number,
    postId: number,
    files: Express.Multer.File[],
  ): Promise<any> {
    // Ensure the user has access to the post
    const post = await this.findPostByIdAndCheckSchool(userId, postId);
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    
    // Check if files parameter is valid
    if (!files || files.length === 0) {
      throw new NotFoundException('No files uploaded');
    }
    
    // Read AWS credentials from environment variables
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');

    // Initialize S3 client with credentials
    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Define folder structure
    const folderName = `schools/${post.school_id}/posts/${postId}/images/`;

    // Upload images to S3 bucket
    const uploadPromises: Promise<any>[] = [];
    for (const file of files) {
      const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: folderName + extname(file.originalname),
        Body: file.buffer,
        ACL: 'private',
      };
      uploadPromises.push(s3.send(new PutObjectCommand(uploadParams)));
    }

    // Wait for all uploads to finish
    await Promise.all(uploadPromises);

    return { status: 'success', message: 'Tải lên hình ảnh thành công' };
  }
}
