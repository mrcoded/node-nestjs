import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { PostsService } from '../posts.service';

//custom pipe
@Injectable()
export class PostExistsPipe implements PipeTransform {
  constructor(private readonly postsService: PostsService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.postsService.findOne(value);
    } catch (error) {
      throw new NotFoundException(`Post with ID ${value} is NotFound`);
    }

    return value;
  }
}
