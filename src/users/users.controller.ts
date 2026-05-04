import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId/documents')
  @UseGuards(JwtAuthGuard)
  async getUserDocuments(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getUserDocuments(userId);
  }

  @Post(':userId/documents')
  @UseGuards(JwtAuthGuard)
  async createDocument(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    return this.usersService.createDocument(userId, createDocumentDto);
  }
}

