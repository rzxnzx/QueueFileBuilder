import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [UsersService, JwtService, DatabaseService],
  controllers: [UsersController]
})
export class UsersModule {}
