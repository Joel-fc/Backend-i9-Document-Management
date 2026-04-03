import { Controller, Post, Body } from '@nestjs/common';
import { CreateLoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthService } from './auth.service'


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() data: CreateLoginDto) {
        return this.authService.signIn(data)
    }

    @Post('register')
    register(@Body() data: RegisterDto) {
        return this.authService.signUp(data)
    }

  
}
