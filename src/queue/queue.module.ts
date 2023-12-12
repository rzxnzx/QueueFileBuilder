import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BuilderService } from 'src/builder/builder.service';
import { EXCEL_GENERATION } from 'src/constants/Queues/excelQueue.constants';
import { ExcelProcessor } from 'src/excel/excel.consumer';
@Module({
    imports: [
        BullModule.registerQueue({
            name: EXCEL_GENERATION,
        }),
    ],
    providers: [ExcelProcessor, BuilderService],
    exports: [BullModule],
})
export class QueueModule { }
