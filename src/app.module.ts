import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExcelModule } from './excel/excel.module';
import { DatabaseModule } from './database/database.module';
import { BuilderService } from './builder/builder.service';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';
import { EmailConfig, RedisSettings } from './settings';
import { ZipService } from './zip/zip.service';
import { EmailService } from './email/email/email.service';

@Module({
  imports:
    [
      ConfigModule.forRoot(), AuthModule, UsersModule, ExcelModule, DatabaseModule, BullModule.forRoot({
        redis: {
          host: RedisSettings.host,
          port: RedisSettings.port
        }
      }), QueueModule,
    ],
  controllers: [AppController],
  providers: [AppService, BuilderService, ZipService, EmailService, EmailConfig],
})
export class AppModule { }
