import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @UseGuards(JwtGuard)
    @Get(':id')
    public async getUserPorfile(@Param("id") id: number) {
        return this.userService.findById(id)
    }
}
