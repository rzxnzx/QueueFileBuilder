import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { ExcelBuilderService } from 'src/excel/builder/excel.builder.service';
import { QueueModule } from 'src/queue/queue.module';
import { ZipService } from 'src/services/zip/zip.service';
import { EmailService } from 'src/services/email/email/email.service';
import { EmailConfig } from 'src/settings';

@Module({
    imports: [QueueModule],
    controllers: [ExcelController],
    providers: [ExcelService, JwtService, DatabaseService, ExcelBuilderService, ZipService, EmailService, EmailConfig]
})

export class ExcelModule { }
