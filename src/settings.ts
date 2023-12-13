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
    smtpHost: string = process.env.SMTP_HOST;
    smtpPort: number = parseInt(process.env.SMTP_PORT);
    smtpUser: string = process.env.SMTP_USER;
    smtpPass: string = process.env.SMTP_PASS;
}