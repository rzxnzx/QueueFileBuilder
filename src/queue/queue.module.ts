import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ExcelBuilderService } from 'src/excel/builder/excel.builder.service';
import { EXCEL_GENERATION } from 'src/constants/Queues/excelQueue.constants';
import { EmailService } from 'src/services/email/email/email.service';
import { ExcelProcessor } from 'src/excel/excel.consumer';
import { EmailConfig } from 'src/settings';
import { ZipService } from 'src/services/zip/zip.service';
@Module({
    imports: [
        BullModule.registerQueue({
            name: EXCEL_GENERATION,
        }),
    ],
    providers: [ExcelProcessor, ExcelBuilderService, ZipService, EmailService, EmailConfig],
    exports: [BullModule],
})
export class QueueModule { }
