import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserDocuments(userId: number) {
    try {
      // First check if user exists
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new NotFoundException(`Usuário não encontrado`);
      }

      const documents = await this.prisma.document.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return {
        user: {
          id: userExists.id,
          name: userExists.name,
          email: userExists.email,
        },
        documents,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar documentos do usuário');
    }
  }
}
