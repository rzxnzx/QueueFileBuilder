import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, PrismaService, JwtService],
  controllers: [UsersController]
})
export class UsersModule {}
