import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateLoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { PrismaService } from '../prisma.service'

@Injectable()
export class AuthService {  
  constructor(private prisma: PrismaService) {}

  async signIn(data: CreateLoginDto) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return { message: 'Login realizado com sucesso!' };
  }

  async signUp(data: RegisterDto) {
    const { email, password, name } = data;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('E-mail já está em uso');
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hash,
      },
    });
  }
}

