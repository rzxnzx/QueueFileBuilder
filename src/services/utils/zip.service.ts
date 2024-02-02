import { Injectable, Logger } from '@nestjs/common';
import * as util from 'util';
import * as fs from 'fs'
import pako from 'pako';

@Injectable()
export class ZipService {
    private readonly logger = new Logger(ZipService.name);

    public async compressExcelFile(inputPath: string, outputPath: string) {
        const readFile = util.promisify(fs.readFile);
        const writeFile = util.promisify(fs.writeFile);

        try {
            const data = await readFile(inputPath);
            const compressedData = pako.gzip(data);
            await writeFile(outputPath, compressedData);
        } catch (error) {
            this.logger.error('Error al comprimir el archivo Excel:', error);
            throw error;
        }
    };
}
