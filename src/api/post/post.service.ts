import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { Post } from '../../common/entities/post.entity';
import { ToggleLike } from '../../common/entities/toggle-like.entity';
import { Comment } from '../../common/entities/comment.entity';
import { Image } from '../../common/entities/image.entity';

import { AuthService } from '../../api/auth/auth.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/decorator/customize';
import { PostHashtag } from 'src/common/entities/post-hashtag.entity';
import { Hashtag } from 'src/common/entities/hashtag.entity';
import { PostImage } from 'src/common/entities/post-image.entity';

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
    private readonly configService: ConfigService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
    @InjectRepository(PostHashtag)
    private readonly postHashtagRepository: Repository<PostHashtag>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>
    
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

  private validateFiles(files: Express.Multer.File[]): void {
    if (!files || files.length === 0) {
      throw new NotFoundException('No files uploaded');
    }
  }

  // private async uploadToS3(
  //   post: Post,
  //   files: Express.Multer.File[],
  // ): Promise<void> {
  //   const region = this.configService.get<string>('AWS_REGION');
  //   const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
  //   const secretAccessKey = this.configService.get<string>(
  //     'AWS_SECRET_ACCESS_KEY',
  //   );
  //   const bucketName = this.configService.get<string>('S3_BUCKET_NAME');

  //   const s3 = new S3Client({
  //     region,
  //     credentials: { accessKeyId, secretAccessKey },
  //   });

  //   const folderName = `schools/${post.school_id}/posts/${post.id}/images/`;

  //   const uploadPromises: Promise<any>[] = [];
  //   const imageEntities: Image[] = [];

  //   for (const file of files) {
  //     const fileName = uuidv4() + extname(file.originalname);
  //     const uploadParams: PutObjectCommandInput = {
  //       Bucket: bucketName,
  //       Key: folderName + fileName,
  //       Body: file.buffer,
  //       ACL: 'private',
  //     };
  //     uploadPromises.push(s3.send(new PutObjectCommand(uploadParams)));

  //     const imageUrl = `${fileName}`;
  //     const image = new Image();
  //     image.url = imageUrl;
  //     image.post = post;
  //     imageEntities.push(image);
  //   }

  //   await Promise.all(uploadPromises);

  //   await this.imageRepository.save(imageEntities);
  // }
  private async uploadToS3(post: Post, files: Express.Multer.File[]): Promise<Image[]> {
    const region =  this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const s3 = new S3Client({
      region,
      credentials: {accessKeyId, secretAccessKey}
    })
    const folderName = `schools/${post.school_id}/posts/${post.id}/images/`;
    const uploadPromises: Promise<any>[] = [];
    const imageEntities: Image[] = [];
    for (const file of files) {
      const fileName = uuidv4() + extname(file.originalname);
      const uploadParams: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: folderName + fileName,
        Body: file.buffer,
        ACL: 'private',
      };
      uploadPromises.push(s3.send(new PutObjectCommand(uploadParams)));

      const imageUrl = `${folderName}${fileName}`;
      const image = new Image();
      image.url = imageUrl;
      image.post = post;
      imageEntities.push(image);

      await Promise.all(uploadPromises);
      return this.imageRepository.save(imageEntities);
    }
  }

  private async mapPostWithImages(post: Post): Promise<any> {
    if (!post) return null;

    const numLikes = post.likes?.length ?? 0;
    const numComments = post.comments?.length ?? 0;
    const likers = post.likes?.map((like) => like.user_id.toString()) ?? [];

    const images = await this.imageRepository.find({
      where: { post_id: post.id },
    });

    const folderName = `schools/${post.school_id}/posts/${post.id}/images/`;
    const imageUrls = images.map((image) => `${folderName}${image.url}`);

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
      images: imageUrls,
    };
  }
 async createAndAssociateHashtags(post: Post, hashtags: string[]): Promise<void> {
    for (const tag of hashtags) {
      let hashtag = await this.hashtagRepository.findOne({where: {tag}});
      if (!hashtag) {
        hashtag = new Hashtag();
        hashtag.tag = tag;
        hashtag = await this.hashtagRepository.save(hashtag);
      }
      const postHashtag = new PostHashtag();
      postHashtag.post = post;
      postHashtag.hashtag = hashtag;
      postHashtag.hash_tag_id = hashtag.id;
      await this.postHashtagRepository.save(postHashtag);
    }
  }

 async create(userId: number, createPostDto: CreatePostDto, files: Express.Multer.File[]): Promise<any> {
    const {title, content, hashtags} = createPostDto;
    const userSchoolIds = await this.getUserSchoolIds(userId);
    if (!userSchoolIds.length) {
      throw new UnauthorizedException('User does not belong to any school');
    }
    const schoolId = userSchoolIds[0];
    console.log(schoolId);
    const post = new Post();
    post.title = title;
    post.content = content;
    post.school_id = schoolId;
    post.created_by = userId;

    const savedPost = await this.postRepository.save(post);

    this.validateFiles(files);
    const images = await this.uploadToS3(savedPost, files);
    for (const image of images) {
      const postImage = new PostImage();
      postImage.post_id = savedPost.id;
      postImage.image_id = image.id;
      await this.postImageRepository.save(postImage);
    }
    await this.createAndAssociateHashtags(savedPost, hashtags);
    const mappedPost = await this.mapPostWithImages(savedPost);
    return {
      status: 'success',
      message: 'Post created successfully',
      data: mappedPost
    }

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

    return Promise.all(posts.map((post) => this.mapPostWithImages(post)));
  }

  async findOne(userId: number, id: number): Promise<any> {
    const post = await this.findPostByIdAndCheckSchool(userId, id);
    if (post.status !== 'published') {
      throw new NotFoundException('Bài viết không tồn tại');
    }
    const mappedPost = await this.mapPostWithImages(post);

    const comments =
      post.comments?.map((comment) => ({
        id: comment.id,
        content: comment.content,
        user_id: comment.user_id,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
      })) ?? [];

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
  ): Promise<{ status: string; message: string }> {
    const post = await this.findPostByIdAndCheckSchool(userId, postId);

    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }

    this.validateFiles(files);

    await this.uploadToS3(post, files);

    return { status: 'success', message: 'Tải lên hình ảnh thành công' };
  }
}
