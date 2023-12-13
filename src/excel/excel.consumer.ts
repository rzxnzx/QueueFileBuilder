import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BuilderService } from 'src/builder/builder.service';
import { EXCEL_GENERATION } from 'src/constants/Queues/excelQueue.constants';
import { Logger } from '@nestjs/common';

@Processor(EXCEL_GENERATION)
export class ExcelProcessor {
  private readonly logger = new Logger(ExcelProcessor.name);

  constructor(private readonly builderService: BuilderService) { }

  @Process()
  public async generateExcel(job: Job) {
    const outputPath = await this.builderService.BuildExcel(job.data);
    this.logger.log(`Generated Excel file at: ${outputPath}`);
    
  }
}
