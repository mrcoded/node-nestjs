import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  //handle signup
  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    //check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create new user
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    //remove password from response
    const { password: _, ...user } = newUser;
    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    //find user by unique email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    //verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = this.jwtService.sign({ userId: user.id });

    //remove password from response
    const { password: _, ...result } = user;

    return { ...result, token };
  }
}
