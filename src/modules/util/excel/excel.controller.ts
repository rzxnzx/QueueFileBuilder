import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { PayloadService } from '../../../services/core/payload.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { PayloadDTO } from './utils/excel.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EXCEL_GENERATION } from 'src/utils/constants/Queues/excelQueue.constants';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('excel')
export class ExcelController {
    private readonly logger = new Logger(ExcelController.name);

    constructor(
        private excel: PayloadService,
        @InjectQueue(EXCEL_GENERATION) private excelQueue: Queue,
        @Inject(CACHE_MANAGER) private cacheManager: Cache, 
    ) { }

    @UseGuards(JwtGuard)
    @Post('generate')
    public async InsertDataAndRetrieveResults(@Body() payloadDTO: PayloadDTO) {
        const insertedId = await this.excel.InsertSQLIntoDatabase(payloadDTO);
        const ExcelData = await this.excel.GetDataFromSQLQuery(insertedId);
        const { email, reporte_titulo, reporte_descripcion } = JSON.parse(payloadDTO.payload);

        const cachedData = await this.cacheManager.get('redis');

        if (cachedData) {
            this.logger.log(`Usando datos de caché.`);
            return cachedData;
        }

        const job = await this.excelQueue.add({ ExcelData, emailData: { email, reporte_titulo, reporte_descripcion } });
        await this.cacheManager.set('redis', job.id);
        this.logger.log(`Added job to the queue: ${job.id}`);
    }
}
