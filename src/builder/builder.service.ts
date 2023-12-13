// src/builder/builder.service.ts
import { Injectable, Inject } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import { ZipService } from '../zip/zip.service';

@Injectable()
export class BuilderService {
    constructor(@Inject(ZipService) private readonly zipService: ZipService) { }
    public async BuildExcel(data: any[]): Promise<string> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        if (data.length > 0) {
            worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key: key }));
            worksheet.addRows(data);
        }

        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}-${currentDate.getMinutes().toString().padStart(2, '0')}-${currentDate.getSeconds().toString().padStart(2, '0')}`;
        const name = `reporte_${formattedDate}_${formattedTime}`;
        const excelFilePath = path.join(__dirname, `../../out/${name}.xlsx`);
        await workbook.xlsx.writeFile(excelFilePath);

        const filesForZip = {};
        filesForZip[`${name}.xlsx`] = fs.readFileSync(excelFilePath);
        const zipContent = await this.zipService.createZip(filesForZip);
        const zipFilePath = path.join(__dirname, `../../out/${name}.zip`);
        fs.writeFileSync(zipFilePath, zipContent);
        fs.unlinkSync(excelFilePath);

        return zipFilePath;
    }
}
