import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(50, { message: 'Title must be at least 50 characters' })
  title?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(3, { message: 'Content must be at least 3 characters' })
  content?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Authoe is required' })
  @IsString({ message: 'Authoe must be a string' })
  @MinLength(3, { message: 'Authoe must be at least 3 characters' })
  @MaxLength(25, { message: 'Authoe must be at least 25 characters' })
  authorName?: string;
}
