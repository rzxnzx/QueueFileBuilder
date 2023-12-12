import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BuilderService } from 'src/builder/builder.service';
import { EXCEL_GENERATION } from 'src/constants/Queues/excelQueue.constants';

@Processor(EXCEL_GENERATION)
export class ExcelProcessor {
  constructor(private readonly builderService: BuilderService) {}

  @Process()
 public async generateExcel(job: Job) {
    console.log(`Processing job ${job.id}: ${JSON.stringify(job.data)}`);
    const outputPath = await this.builderService.BuildExcel(job.data);
    console.log(`Generated Excel file at: ${outputPath}`);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}
