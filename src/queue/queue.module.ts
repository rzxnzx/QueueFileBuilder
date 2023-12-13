import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BuilderService } from 'src/builder/builder.service';
import { EXCEL_GENERATION } from 'src/constants/Queues/excelQueue.constants';
import { EmailService } from 'src/email/email/email.service';
import { ExcelProcessor } from 'src/excel/excel.consumer';
import { EmailConfig } from 'src/settings';
import { ZipService } from 'src/zip/zip.service';
@Module({
    imports: [
        BullModule.registerQueue({
            name: EXCEL_GENERATION,
        }),
    ],
    providers: [ExcelProcessor, BuilderService, ZipService, EmailService, EmailConfig],
    exports: [BullModule],
})
export class QueueModule { }
