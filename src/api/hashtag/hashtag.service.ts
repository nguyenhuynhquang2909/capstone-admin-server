import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hashtag } from '../../common/entities/hashtag.entity';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  async create(createHashtagDto: CreateHashtagDto) {
    const hashtag = this.hashtagRepository.create(createHashtagDto);
    return await this.hashtagRepository.save(hashtag);
  }

  async findAll() {
    return await this.hashtagRepository.find();
  }

  async findOne(id: number) {
    const hashtag = await this.hashtagRepository.findOne({
      where: { id },
    });
    if (!hashtag) {
      throw new NotFoundException(`Thẻ không tồn tại`);
    }
    return hashtag;
  }

  async remove(id: number) {
    const hashtag = await this.findOne(id);
    return await this.hashtagRepository.remove(hashtag);
  }
}
