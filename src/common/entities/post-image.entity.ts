import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { MainImage } from './main-image.entity';

@Entity('post_images')
export class PostImage {
  @PrimaryColumn()
  post_id: number;

  @PrimaryColumn()
  image_id: number;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => MainImage, (mainImage) => mainImage.id)
  @JoinColumn({ name: 'image_id' })
  image: MainImage;
}
