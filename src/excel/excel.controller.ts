import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';

@Controller('excel')
export class ExcelController {
    constructor(private excel: ExcelService) { }
    @Post('generate')
    public async InsertDataIntoDatabase(){
        
    }

    @UseGuards(JwtGuard)
    @Get('data')
    public async GetResultsFromQuery() {
        return this.excel.GetDataFromSQLQuery()
    }
}
