import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId/documents')
  @UseGuards(JwtAuthGuard)
  async getUserDocuments(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getUserDocuments(userId);
  }
}
