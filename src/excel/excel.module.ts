import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { BuilderService } from 'src/builder/builder.service';
import { QueueModule } from 'src/queue/queue.module';
import { ZipService } from 'src/zip/zip.service';

@Module({
    imports: [QueueModule],
    controllers: [ExcelController],
    providers: [ExcelService, JwtService, DatabaseService, BuilderService, ZipService]
})

export class ExcelModule { }
