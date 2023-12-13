import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BuilderService } from 'src/builder/builder.service';
import { EXCEL_GENERATION } from 'src/constants/Queues/excelQueue.constants';
import { ExcelProcessor } from 'src/excel/excel.consumer';
import { ZipService } from 'src/zip/zip.service';
@Module({
    imports: [
        BullModule.registerQueue({
            name: EXCEL_GENERATION,
        }),
    ],
    providers: [ExcelProcessor, BuilderService, ZipService],
    exports: [BullModule],
})
export class QueueModule { }
