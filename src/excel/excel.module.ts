import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Module({
    controllers: [ExcelController],
    providers: [ExcelService, JwtService, DatabaseService]
})
export class ExcelModule { }
