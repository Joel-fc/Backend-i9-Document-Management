import { Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {  
  async login(data: CreateLoginDto) {
      console.log(data)
      return "Login Sucedido!"
    }
}
