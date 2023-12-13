// src/zip/zip.service.ts
import { Injectable } from '@nestjs/common';
import * as JSZip from 'jszip';
import * as fs from 'fs';

@Injectable()
export class ZipService {
    constructor() { }

    public async createZip(files: { [filename: string]: Buffer }): Promise<Buffer> {
        const zip = new JSZip();

        for (const [filename, content] of Object.entries(files)) {
            zip.file(filename, content);
        }

        return await zip.generateAsync({ type: 'nodebuffer' });
    }
}
