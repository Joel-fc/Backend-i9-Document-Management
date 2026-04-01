import { Controller, Post, Body } from '@nestjs/common';
import { CreateLoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() data: CreateLoginDto) {
        return this.authService.login(data)
    }

  
}
