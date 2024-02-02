import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExcelBuilderService } from './modules/util/excel/services/excel.builder.service';
import { DatabaseModule } from './modules/core/database/mysql/database.module';
import { ExcelModule } from './modules/util/excel/excel.module';
import { QueueModule } from './modules/core/queue/queue.module';
import { EmailConfig } from './settings';
import { ZipService } from './services/zip/zip.service';
import { EmailService } from './services/email/email.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from './modules/core/database/redis/redis.module';
import { ColorService } from './services/colors/color.service';
import { TimeService } from './services/time/time.service';

@Module({
  imports: [ConfigModule.forRoot(), ExcelModule, DatabaseModule, QueueModule, CacheModule.register(), RedisModule],
  controllers: [],
  providers: [ExcelBuilderService, ZipService, EmailService, EmailConfig, ColorService, TimeService],
})
export class AppModule { }
