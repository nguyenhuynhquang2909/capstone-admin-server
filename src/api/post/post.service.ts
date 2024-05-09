import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../../common/entities/post.entity';
import { User } from '../../common/entities/user.entity';
import { School } from '../../common/entities/school.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { school_id, user_id, ...rest } = createPostDto;

    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(`Người dùng không tồn tại`);
    }

    // Check if the school exists
    const school = await this.schoolRepository.findOne({
      where: { id: school_id },
    });
    if (!school) {
      throw new NotFoundException(`Trường học không tồn tại`);
    }

    // Create the new post
    const newPost = this.postRepository.create({
      ...rest,
      school_id: String(school_id),
      user_id: String(user_id),
    });
    return await this.postRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Bài viết không tồn tại`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }
}
