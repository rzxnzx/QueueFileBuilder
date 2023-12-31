import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv'
import * as mysql from 'mysql2';
dotenv.config();

export const Query = {
    BaseQuery: process.env.BASE_QUERY
}

export const PoolSettings = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

export const RedisSettings = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
}

@Injectable()
export class EmailConfig {
    smtpHost: string = 'tu_servidor_smtp';
    smtpPort: number = 587;
    smtpUser: string = 'tu_usuario_smtp';
    smtpPass: string = 'tu_contraseña_smtp';
}