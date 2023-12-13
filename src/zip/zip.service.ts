// src/zip/zip.service.ts
import { Injectable } from '@nestjs/common';
import JSZip from 'jszip';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ZipService {
    constructor() { }

    public async zipFile(filePath: string): Promise<string> {
        const fileName = path.basename(filePath, path.extname(filePath));
        const directory = path.dirname(filePath);
        const zip = new JSZip();
        const fileContent = fs.readFileSync(filePath);
        zip.file(path.basename(filePath), fileContent);

        const zipPath = path.join(directory, `${fileName}.zip`);
        const zipContent = await zip.generateAsync({ type: "nodebuffer" });
        fs.writeFileSync(zipPath, zipContent);

        return zipPath;
    }
}
