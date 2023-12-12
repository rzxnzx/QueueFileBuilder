import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLogin } from './dto/auth.dto';
import { RefreshJwtGuard } from 'src/guards/refresh/refresh.guard';
import { User } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UsersService) { }

    @Post('auth')
    public async login(@Body() Auth: AuthLogin) {
        return await this.authService.login(Auth)
    }
}
