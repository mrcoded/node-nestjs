import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post as PostInterface } from './interfaces/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponses } from 'src/common/interfaces/pagination-responses.interfaces';
import type { Cache } from 'cache-manager';

@Injectable()
export class PostsService {
  private postListCacheKeys: Set<string> = new Set();

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generatePostsListCacheKey(query: FindPostsQueryDto): string {
    const { page = 1, limit = 1, title } = query;
    return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
  }

  async findAll(query: FindPostsQueryDto): Promise<PaginatedResponses<Post>> {
    const cachekey = this.generatePostsListCacheKey(query);

    this.postListCacheKeys.add(cachekey);

    const getCachedData =
      await this.cacheManager.get<PaginatedResponses<Post>>(cachekey);

    if (getCachedData) {
      console.log(
        `Cache hit -------- returning post lists from cache ${cachekey}`,
      );
      return getCachedData;
    }
    //if cache is not present
    console.log(`Cache missed -------- returning post lists db`);

    const { page = 1, limit = 10, title } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.authorName', 'authorName')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (title) {
      queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` });
    }

    const [items, totalItems] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    const responseResult = {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };

    await this.cacheManager.set(cachekey, responseResult, 30000);
    return responseResult;
  }

  async findOne(id: number): Promise<Post> {
    const cachekey = `post_${id}`;
    const cachePost = await this.cacheManager.get<Post>(cachekey);

    if (cachePost) {
      console.log(`Cache hit -------- returning post from cache ${cachekey}`);

      return cachePost;
    }

    //if cache is not present
    console.log(`Cache missed -------- returning post lists db`);

    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['authorName'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} is NotFound`);
    }

    //store the post in cache
    await this.cacheManager.set(cachekey, post, 30000);
    return post;
  }

  async create(createPost: CreatePostDto, authorName: User): Promise<Post> {
    const newPost: Post = this.postsRepository.create({
      title: createPost.title,
      content: createPost.content,
      authorName,
    });

    //Invalidate existing cache
    await this.invalidateAllExistingCache();

    return this.postsRepository.save(newPost);
  }

  async update(
    id: number,
    updatePost: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const findPost = await this.findOne(id);

    if (!findPost) {
      throw new NotFoundException(`Post with ID ${id} is NotFound`);
    }

    if (findPost.authorName.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own posts');
    }

    if (updatePost.title) findPost.title = updatePost.title;
    if (updatePost.content) findPost.content = updatePost.content;

    const updatedPost = await this.postsRepository.save(findPost);

    //invalidate existing cache
    await this.cacheManager.del(`post_${id}`);

    await this.invalidateAllExistingCache();

    return updatedPost;
  }

  async remove(id: number): Promise<{ message: string }> {
    const findPost = await this.findOne(id);

    if (findPost) {
      throw new NotFoundException(`Post with ID ${id} is NotFound`);
    }

    this.postsRepository.remove(findPost);

    await this.cacheManager.del(`post_${id}`);

    await this.invalidateAllExistingCache();

    return { message: `Post with ID ${id} is deleted` };
  }

  private async invalidateAllExistingCache(): Promise<void> {
    console.log(
      `Invalidating ${this.postListCacheKeys.size} lisit cache entries`,
    );

    for (const key of this.postListCacheKeys) {
      await this.cacheManager.del(key);
    }

    this.postListCacheKeys.clear();
  }

  // private getNextId(): number {
  //   return this.posts.length > 0
  //     ? Math.max(...this.posts.map((post) => post.id)) + 1
  //     : 1;
  // }
}
