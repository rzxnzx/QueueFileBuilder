import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { BuilderService } from 'src/builder/builder.service';


@Module({
    controllers: [ExcelController],
    providers: [ExcelService, JwtService, DatabaseService, BuilderService]
})
export class ExcelModule { }
