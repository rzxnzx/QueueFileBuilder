import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Query } from 'src/settings';
import { PayloadDTO } from './DTO/excel.dto';

@Injectable()
export class ExcelService {
    constructor(private database: DatabaseService) { }

    public async InsertSQLIntoDatabase(value: PayloadDTO): Promise<number> {

        let fields = [];
        let placeholders = [];
        let params = [];

        fields.push("empresa");
        placeholders.push("?");
        params.push(value.empresa);

        if (value.payload !== undefined) {
            fields.push("payload");
            placeholders.push("?");
            params.push(value.payload);
        }

        fields.push("usuario");
        placeholders.push("?");
        params.push(value.usuario);

        if (value.tipo !== undefined) {
            fields.push("tipo");
            placeholders.push("?");
            params.push(value.tipo);
        }

        if (value.raw_query !== undefined) {
            fields.push("raw_query");
            placeholders.push("?");
            params.push(value.raw_query);
        }

        if (value.created_At !== undefined) {
            fields.push("created_at");
            placeholders.push("?");
            params.push(value.created_At);
        }

        if (value.deleted_At !== undefined) {
            fields.push("deleted_at");
            placeholders.push("?");
            params.push(value.deleted_At);
        }

        const query = `INSERT INTO queue_jobs (${fields.join(", ")}) VALUES (${placeholders.join(", ")})`;
        await this.database.insertData(query, params);
        const lastId = await this.database.getLastInsertedId();
        return lastId;
    }


    public async GetDataFromSQLQuery(id: number) {
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
