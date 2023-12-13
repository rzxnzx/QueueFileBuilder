import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { PayloadDTO } from './DTO/excel.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EXCEL_GENERATION } from 'src/constants/Queues/excelQueue.constants';


@Controller('excel')
export class ExcelController {
    private readonly logger = new Logger(ExcelController.name);
    constructor(
        private excel: ExcelService,
        @InjectQueue(EXCEL_GENERATION) private excelQueue: Queue
    ) { }

    // @UseGuards(JwtGuard)
    @Post('generate')
    public async InsertDataAndRetrieveResults(@Body() payloadDTO: PayloadDTO) {
        const insertedId = await this.excel.InsertSQLIntoDatabase(payloadDTO);
        const ExcelData = await this.excel.GetDataFromSQLQuery(insertedId);

        // Extraer datos de email, subject y message del campo "payload"
        const { email, reporte_titulo, reporte_descripcion } = JSON.parse(payloadDTO.payload);

        const job = await this.excelQueue.add({ ExcelData, emailData: { email, reporte_titulo, reporte_descripcion } });
        this.logger.log(`Added job to the queue: ${job.id}`);
    }
}