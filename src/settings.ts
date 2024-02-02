import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv'
import * as mysql from 'mysql2';
dotenv.config();

export const CoreSettings = {
    Token: process.env.JTW_TOKEN
}

/**
 * Configuración para la conexión a la base de datos MySQL.
 */
export const PoolSettings = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

/**
 * Configuración para la conexión a Redis.
 */
export const RedisSettings = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
}

/**
 * Configuración para la conexión SMTP para el envío de correos.
 */
@Injectable()
export class EmailConfig {
    smtpHost: string = process.env.SMTP_HOST;
    smtpPort: number = parseInt(process.env.SMTP_PORT);
    smtpUser: string = process.env.SMTP_USER;
    smtpPass: string = process.env.SMTP_PASS;
}
