import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Name is required! Please provide a valid name' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(25, { message: 'Name must be at least 25 characters' })
  name: string;

  @IsNotEmpty({ message: 'Password is required! Please provide a valid name' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsString()
  password: string;
}
