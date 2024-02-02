import { Injectable, Inject, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import { ZipService } from 'src/services/utils/zip.service';
import { EmailService } from 'src/services/email/email.service';
import { promisify } from 'util';
import { EmailDataDTO } from 'src/services/email/utils/email.dto';

@Injectable()
export class ExcelBuilderService {
    private readonly logger = new Logger(ExcelBuilderService.name);

    constructor(
        @Inject(ZipService) private readonly zipService: ZipService,
        @Inject(EmailService) private readonly emailService: EmailService
    ) { }

    public async BuildExcel(data: any[], emailData: EmailDataDTO): Promise<string> {
        try {
            const currentDate = new Date();
            const name = `reporte_${currentDate.getTime()}`;
            const excelFilePath = path.join(__dirname, `../../../../out/${name}.xlsx`);
            
            const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
                filename: excelFilePath
            });

            const batchSize = 50000;

            for (let startIndex = 0; startIndex < data.length; startIndex += batchSize) {
                const endIndex = Math.min(startIndex + batchSize, data.length);
                const batch = data.slice(startIndex, endIndex);
                await this.generateExcelWorksheet(workbook, batch, `Hoja ${startIndex / batchSize + 1}`);
            }

            await workbook.commit();
            const zipFilePath = await this.createZipFile(excelFilePath, name);
            await this.sendEmailWithAttachment(emailData, zipFilePath, `${name}.xlsx.gz`);
            await this.cleanupFiles(name);
            
            return zipFilePath;
        } catch (error) {
            this.logger.error('Error al construir y enviar el archivo:', error);
            throw error;
        }
    }

    private async generateExcelWorksheet(workbook: any, batch: any[], sheetName: string): Promise<void> {
        const worksheet = workbook.addWorksheet(sheetName);
        worksheet.columns = Object.keys(batch[0]).map(key => ({ header: key, key: key }));

        for (const row of batch) {
            worksheet.addRow(row);
        }
    }

    private async createZipFile(excelFilePath: string, name: string): Promise<string> {
        const compressedExcelPath = path.join(__dirname, `../../../../out/${name}_compressed.xlsx.gz`);
        await this.zipService.compressExcelFile(excelFilePath, compressedExcelPath);
    
        return compressedExcelPath;
    }

    private async sendEmailWithAttachment(emailData: EmailDataDTO, zipFilePath: string, name: string): Promise<void> {
        const { email, reporte_titulo, reporte_descripcion } = emailData;

        await this.emailService.sendEmailWithAttachment(email, reporte_titulo, reporte_descripcion, zipFilePath, name);
    }

    private async cleanupFiles(name: string): Promise<void> {
        const directoryPath = path.join(__dirname, '../../../../out/');
        const filesToDelete = fs.readdirSync(directoryPath)
            .filter(file => file.startsWith(name) && (file.endsWith('.xlsx') || file.endsWith('.zip')) || file.endsWith('.gz'));

        const deletePromises = filesToDelete.map(file => {
            const filePath = path.join(directoryPath, file);
            return promisify(fs.unlink)(filePath);
        });
        
        await Promise.all(deletePromises);
    }
}
