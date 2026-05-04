import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';

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

  async createDocument(userId: number, dto: CreateDocumentDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`Usuário não encontrado`);
    }

    try {
      const document = await this.prisma.document.create({
        data: {
          name: dto.name,
          fileUrl: dto.fileUrl,
          user: { connect: { id: userId } },
        },
      });

      return document;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar o documento');
    }
  }
}

