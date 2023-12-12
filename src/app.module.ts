import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExcelModule } from './excel/excel.module';
import { DatabaseModule } from './database/database.module';
import { BuilderService } from './builder/builder.service';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, ExcelModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, BuilderService],
})
export class AppModule { }
