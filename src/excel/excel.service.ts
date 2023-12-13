import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Query } from 'src/settings';
import { PayloadDTO } from './DTO/excel.dto';

@Injectable()
export class ExcelService {
    constructor(private database: DatabaseService) { }

    public async InsertSQLIntoDatabase(value: PayloadDTO): Promise<number> {
        const fields = [];
        const placeholders = [];
        const params = [];
        
        const fieldMappings = {
            'empresa': value.empresa,
            'payload': value.payload,
            'usuario': value.usuario,
            'tipo': value.tipo,
            'raw_query': value.raw_query,
            'created_at': value.created_At,
            'deleted_at': value.deleted_At
        };

        for (const [field, fieldValue] of Object.entries(fieldMappings)) {
            if (fieldValue !== undefined) {
                fields.push(field);
                placeholders.push('?');
                params.push(fieldValue);
            }
        }

        const query = `INSERT INTO queue_jobs (${fields.join(", ")}) VALUES (${placeholders.join(", ")})`;
        await this.database.insertData(query, params);
        const lastId = await this.database.getLastInsertedId();
        return lastId;
    }

    public async GetDataFromSQLQuery(id: number): Promise<any[]> {
        const sql = await this.ExtractSQLFromDatabase(id);
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
