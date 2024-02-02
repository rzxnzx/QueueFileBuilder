import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { PayloadService } from '../../../services/core/payload.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/modules/core/database/mysql/database.service';
import { ExcelBuilderService } from 'src/modules/util/excel/services/excel.builder.service';
import { QueueModule } from 'src/modules/core/queue/queue.module';
import { ZipService } from 'src/services/zip/zip.service';
import { EmailService } from 'src/services/email/email.service';
import { EmailConfig } from 'src/settings';
import { CacheModule } from '@nestjs/cache-manager';
import { ColorService } from 'src/services/colors/color.service';
import { TimeService } from 'src/services/time/time.service';


@Module({
    imports: [QueueModule, CacheModule.register()],
    controllers: [ExcelController],
    providers: [PayloadService, JwtService, DatabaseService, ExcelBuilderService, ZipService, EmailService, EmailConfig, ColorService, TimeService]
})

export class ExcelModule { }
