import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLogin } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('auth')
    public async login(@Body() Auth: AuthLogin) {
        return await this.authService.login(Auth)
    }
}
