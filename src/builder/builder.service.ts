import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import * as JSZip from 'jszip';

@Injectable()
export class BuilderService {
    constructor() { }

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
        
        // Guardar el archivo Excel
        await workbook.xlsx.writeFile(excelFilePath);
        
        // Crear un archivo ZIP y agregar el archivo Excel
        const zip = new JSZip();
        zip.file(`${name}.xlsx`, fs.readFileSync(excelFilePath));
        
        // Guardar el archivo ZIP en la misma ruta
        const zipFilePath = path.join(__dirname, `../../out/${name}.zip`);
        const zipData = await zip.generateAsync({ type: 'nodebuffer' });
        fs.writeFileSync(zipFilePath, zipData);

        // Eliminar el archivo Excel (opcional)
        fs.unlinkSync(excelFilePath);

        return zipFilePath;
    }
}
