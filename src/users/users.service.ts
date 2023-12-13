import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private databaseService: DatabaseService) { }

    public async findByEmail(email: string) {
        const query = 'SELECT * FROM User WHERE email = ?';
        const params = [email];
        const user = await this.databaseService.getData(query, params);

        if (user.length === 0) {
            throw new NotFoundException('Usuario no encontrado'); 
        }
        return user[0];
    }

    public async findById(id: number) {
        const query = 'SELECT * FROM User WHERE id = ?'; 
        const params = [id];
        const user = await this.databaseService.getData(query, params);

        if (user.length === 0) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user[0]; 
    }
}
