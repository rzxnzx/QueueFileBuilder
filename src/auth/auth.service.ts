import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthLogin } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) { }

    public async login(Auth: AuthLogin) {
        const user = await this.validateUser(Auth);
        const payload = { username: user.email }

        return {
            user, backendTokens: {
                accessToken: await this.jwtService.signAsync(payload, {
                    secret: process.env.JwtSecretKey,
                })
            }
        }
    }

    private async validateUser(Auth: AuthLogin) {
        const user = await this.userService.findByEmail(Auth.email);
        if (user && (await compare(Auth.password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException();
    }
}
