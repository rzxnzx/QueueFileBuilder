import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ExcelBuilderService } from 'src/modules/util/excel/services/excel.builder.service';
import { EXCEL_GENERATION } from 'src/utils/constants/Queues/excelQueue.constants';
import { Injectable } from '@nestjs/common';
import { performance } from 'perf_hooks';
import { ColorService } from 'src/services/colors/color.service';
import { TimeService } from 'src/services/time/time.service';

@Injectable()
@Processor(EXCEL_GENERATION)
export class ExcelProcessor {
  constructor(private readonly builderService: ExcelBuilderService, private colorService: ColorService, private timeService: TimeService) { }

  @Process()
  public async generateExcel(job: Job) {
    const loadingAnimation = ['|', '/', '-', '\\'];
    let animationIndex = 0;

    const loadingInterval = setInterval(() => {
      process.stdout.clearLine(0); 
      process.stdout.cursorTo(0);
      process.stdout.write(
        `${this.colorService.Colorize(`[Nest] ${process.pid}  - `, 'green')}${this.timeService.getCurrentDateTime()}   ${this.colorService.Colorize(
          '  LOG',
          'green',
        )} ${this.colorService.Colorize('[ExcelModule]', 'yellow')} ${this.colorService.Colorize(`Generating Excel file for job`, 'green')} ${this.colorService.Colorize(
          `${job.id}`,
          'yellow',
        )} ${this.colorService.Colorize(`${loadingAnimation[animationIndex]} please wait...`, 'yellow')}`,
      );
      animationIndex = (animationIndex + 1) % loadingAnimation.length;
    }, 100);

    const { ExcelData, emailData } = job.data;
    const t0 = performance.now();

    try {
      await this.builderService.BuildExcel(ExcelData, emailData);

      const t1 = performance.now();
      const executionTimeMs = t1 - t0;
      const minutes = Math.floor(executionTimeMs / 60000);
      const seconds = ((executionTimeMs % 60000) / 1000).toFixed(2);

      clearInterval(loadingInterval);
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${this.colorService.Colorize(`[Nest] ${process.pid} - `, 'green')}${this.timeService.getCurrentDateTime()}      ${this.colorService.Colorize(
      'LOG',
        'green',
      )} ${this.colorService.Colorize(
        '[ExcelModule]',
        'yellow',
      )} Sent Generated Zipped Excel file for the job ${job.id}!\n`);
      process.stdout.write(`${this.colorService.Colorize(`[Nest]  ${process.pid}  - `, 'green')}${this.timeService.getCurrentDateTime()}     ${this.colorService.Colorize(
      'LOG',
        'green',
      )} ${this.colorService.Colorize(
        '[ExcelModule]',
        'yellow',
      )} Took ${minutes} minutes and ${seconds} seconds.\n`);
    } catch (error) {
      clearInterval(loadingInterval);
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stderr.write(`[${this.colorService.Colorize(`Nest ${process.pid}  -`, 'green')}]  ${this.timeService.getCurrentDateTime()}     ERROR [${this.colorService.Colorize(
        'ExcelModule',
        'yellow',
      )}] Error while generating Excel for job ${job.id}: ${error.message}\n`);
    }
  }


}
