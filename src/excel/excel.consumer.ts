import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ExcelBuilderService } from 'src/excel/builder/excel.builder.service';
import { EXCEL_GENERATION } from 'src/constants/Queues/excelQueue.constants';
import { Logger } from '@nestjs/common';

@Processor(EXCEL_GENERATION)
export class ExcelProcessor {
  private readonly logger = new Logger(ExcelProcessor.name);

  constructor(private readonly builderService: ExcelBuilderService) { }

  @Process()
  public async generateExcel(job: Job) {
    const t0 = performance.now();
    const { ExcelData, emailData } = job.data;

    await this.builderService.BuildExcel(ExcelData, emailData);
    
    const t1 = performance.now();
    const executionTimeMs = t1 - t0;
    const minutes = Math.floor(executionTimeMs / 60000);
    const seconds = ((executionTimeMs % 60000) / 1000).toFixed(2);

    this.logger.log(`Sent Generated Zipped Excel file for the job ${job.id}!`);
    this.logger.log(`Took ${minutes} minutes and ${seconds} seconds.`);
  }
}
