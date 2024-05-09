import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../common/entities/post.entity';
import { AuthService } from '../../api/auth/auth.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly authService: AuthService,
  ) {}

  async findAll(userId: number): Promise<Post[]> {
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
      .where('school.id IN (:...schoolIds)', { schoolIds })
      .getMany();

    return posts;
  }

  async findOne(userId: number, id: number): Promise<Post> {
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
      .where('post.id = :id', { id })
      .andWhere('school.id IN (:...schoolIds)', { schoolIds })
      .getOne();

    if (!post) {
      throw new NotFoundException(`Bài viết không tồn tại`);
    }

    return post;
  }
}
