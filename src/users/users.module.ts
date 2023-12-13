import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [UsersService, JwtService, DatabaseService],
  controllers: []
})
export class UsersModule {}
