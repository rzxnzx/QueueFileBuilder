import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { PayloadDTO } from './DTO/excel.dto';
import { BuilderService } from 'src/builder/builder.service';


@Controller('excel')
export class ExcelController {
    constructor(private excel: ExcelService, private builder: BuilderService) { }

    @UseGuards(JwtGuard)
    @Post('generate')
    public async InsertDataAndRetrieveResults(@Body() payloadDTO: PayloadDTO) {
        const insertedId = await this.excel.InsertSQLIntoDatabase(payloadDTO);
        const ExcelData = await this.excel.GetDataFromSQLQuery(insertedId);
        await this.builder.BuildExcel(ExcelData);
        return;
    }
}

