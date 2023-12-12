import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { PayloadDTO } from './DTO/excel.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EXCEL_GENERATION } from 'src/constants/Queues/excelQueue.constants';


@Controller('excel')
export class ExcelController {
    constructor(
        private excel: ExcelService,
        @InjectQueue(EXCEL_GENERATION) private excelQueue: Queue
    ) { }

    @UseGuards(JwtGuard)
    @Post('generate')
    public async InsertDataAndRetrieveResults(@Body() payloadDTO: PayloadDTO) {
        const insertedId = await this.excel.InsertSQLIntoDatabase(payloadDTO);
        const ExcelData = await this.excel.GetDataFromSQLQuery(insertedId);
        const job = await this.excelQueue.add(ExcelData);
        console.log(`Added job to the queue: ${job.id}`);
    }
}