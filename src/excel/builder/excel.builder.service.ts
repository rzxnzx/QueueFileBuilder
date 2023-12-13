import { Injectable, Inject } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import { ZipService } from '../../services/zip/zip.service';
import { EmailService } from 'src/services/email/email/email.service';
import { promisify } from 'util';

@Injectable()
export class ExcelBuilderService {
    constructor(
        @Inject(ZipService) private readonly zipService: ZipService,
        @Inject(EmailService) private readonly emailService: EmailService
    ) { }

    public async BuildExcel(data: any[]): Promise<string> {
        try {
            const currentDate = new Date();
            const name = `reporte_${currentDate.getTime()}`;
            const zipFilePath = path.join(__dirname, `../../out/${name}.zip`);

            const batches = this.splitDataIntoBatches(data, name);
            const excelFilePaths = await this.generateExcelFiles(batches, name);
            const mergedExcelFilePath = await this.mergeExcelFiles(excelFilePaths, name);

            const ZipFilePath = await this.createZipFile(mergedExcelFilePath, name);

            await this.sendEmailWithAttachment(zipFilePath, name);

            return ZipFilePath;
        } catch (error) {
            console.error('Error al construir y enviar el archivo:', error);
            throw error;
        }
    }

    private splitDataIntoBatches(data: any[], name: string): any[][] {
        const batchSize = 50000;
        const batches = [];

        for (let startIndex = 0; startIndex < data.length; startIndex += batchSize) {
            const endIndex = Math.min(startIndex + batchSize, data.length);
            const batch = data.slice(startIndex, endIndex);
            batches.push(batch);
        }

        return batches;
    }

    private async generateExcelFiles(batches: any[][], name: string): Promise<string[]> {
        const excelFilePaths = [];

        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            const excelFilePath = await this.generateExcelFile(batch, name, i);
            excelFilePaths.push(excelFilePath);
        }

        return excelFilePaths;
    }

    private async generateExcelFile(batch: any[], name: string, index: number): Promise<string> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        if (batch.length > 0) {
            worksheet.columns = Object.keys(batch[0]).map(key => ({ header: key, key: key }));
            worksheet.addRows(batch);
        }

        const excelFilePath = path.join(__dirname, `../../out/${name}_${index}.xlsx`);
        const stream = fs.createWriteStream(excelFilePath);
        await workbook.xlsx.write(stream);
        stream.end();

        return excelFilePath;
    }

    private async mergeExcelFiles(excelFilePaths: string[], name: string): Promise<string> {
        const mergedWorkbook = new ExcelJS.Workbook();
        const mergedWorksheet = mergedWorkbook.addWorksheet('MergedSheet');

        for (const excelFilePath of excelFilePaths) {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(excelFilePath);
            const worksheet = workbook.getWorksheet(1);
            mergedWorksheet.addRows(worksheet.getSheetValues());
            await promisify(fs.unlink)(excelFilePath);
        }

        const mergedExcelFilePath = path.join(__dirname, `../../out/${name}_merged.xlsx`);
        const mergedStream = fs.createWriteStream(mergedExcelFilePath);
        await mergedWorkbook.xlsx.write(mergedStream);
        mergedStream.end();

        return mergedExcelFilePath;
    }

    private async createZipFile(mergedExcelFilePath: string, name: string): Promise<string> {
        const mergedExcelBuffer = fs.readFileSync(mergedExcelFilePath);
        const filesForZip = {
            [`${name}_merged.xlsx`]: mergedExcelBuffer,
        };

        const zipContent = await this.zipService.createZip(filesForZip);

        const zipFilePath = path.join(__dirname, `../../out/${name}.zip`);
        const zipStream = fs.createWriteStream(zipFilePath);
        zipStream.write(zipContent);
        zipStream.end();

        return zipFilePath;
    }

    private async sendEmailWithAttachment(zipFilePath: string, name: string): Promise<void> {
        const recipientEmail = 'noahwalker2507@gmail.com';
        const subject = 'Correo de prueba';
        const message = 'Mensaje de correo electrónico';

        await this.emailService.sendEmailWithAttachment(recipientEmail, subject, message, zipFilePath);
        await Promise.all([
            promisify(fs.unlink)(zipFilePath),
            promisify(fs.unlink)(path.join(__dirname, `../../out/${name}_merged.xlsx`))
        ]);
    }

}
