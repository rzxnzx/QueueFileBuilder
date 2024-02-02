import { Injectable } from '@nestjs/common';
import { PoolSettings } from 'src/settings';
import * as mysql from 'mysql2';

@Injectable()
export class DatabaseService {
    private pool: mysql.Pool;

    constructor() {
        this.pool = PoolSettings;
    }

    /**
     * 
     * @param {string} query Consulta SQL que se planea realizar  
     * @param {params} params Parametros que se realizaran en la consulta, como where, set, etc. 
     * @returns results
     */
    public getData(query: string, params?: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    // Insertar datos
    public insertData(query: string, params: any[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

    public getLastInsertedId(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT LAST_INSERT_ID() as lastId', (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results[0].lastId);
            });
        });
    }

}
