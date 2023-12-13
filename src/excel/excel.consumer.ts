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
    await this.builderService.BuildExcel(job.data);
    this.logger.log(`Sent Generated Zipped Excel file!`);
  }
}
