import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required! Please provide a valid name' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
