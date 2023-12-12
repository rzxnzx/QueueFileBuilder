import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Query } from 'src/settings';

@Injectable()
export class ExcelService {
    constructor(private database: DatabaseService) { }

    public InsertSQLIntoDatabase(Query: any[]) {
        const data = this.database.insertData("INSERT INTO queue_jobs WHERE (empresa, usuario, raw_query) VALUES (?, ?, ?)", Query)
        return data;
    }

    public async GetDataFromSQLQuery() {
        const sql = await this.ExtractSQLFromDatabase(18);
        const data = await this.database.getData(sql);
        return data;
    }

    private async ExtractSQLFromDatabase(id: number): Promise<string> {
        const results = await this.database.getData(Query.BaseQuery, [id]);
        if (results.length > 0 && results[0].raw_query) {
            return results[0].raw_query;
        } else {
            throw new Error("No se encontró la consulta SQL para el ID proporcionado");
        }
    }
}
