import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ExcelBuilderService } from 'src/modules/util/excel/services/excel.builder.service';
import { EXCEL_GENERATION } from 'src/utils/constants/Queues/excelQueue.constants';
import { EmailService } from 'src/services/email/email.service';
import { ExcelProcessor } from 'src/modules/util/excel/processors/excel.processor';
import { EmailConfig, RedisSettings } from 'src/settings';
import { ZipService } from 'src/services/zip/zip.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ColorService } from 'src/services/colors/color.service';
import { TimeService } from 'src/services/time/time.service';

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: RedisSettings.host,
                port: RedisSettings.port
            }
        }),
        BullModule.registerQueue({
            name: EXCEL_GENERATION,
        }), CacheModule.register()
    ],
    providers: [ExcelProcessor, ExcelBuilderService, ZipService, EmailService, EmailConfig, ColorService, TimeService],
    exports: [BullModule],
})
export class QueueModule { }
