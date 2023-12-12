import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    public async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email: email } })
    }

    public async findById(id: number) {
        const userId = Number(id);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if(!user){
          return new NotFoundException()
        }
        return user;
    }
}
