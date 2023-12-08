import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    public async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email: email } })
    }

    public async findById(id: number) {
        return await this.prisma.user.findUnique({ where: { id: id } })
    }

    public async create(user: User) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });
    
        if (existingUser) {
            throw new ConflictException('Email is already registered.');
        } else {
            if (!user.password) {
                throw new BadRequestException('Password is required.');
            }
    
            const newUser = await this.prisma.user.create({
                data: {
                    ...user,
                    password: await hash(user.password, 10),
                },
            });
    
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = newUser;
            return result;
        }
    }
    
}
