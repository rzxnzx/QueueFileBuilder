import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Query } from 'src/settings';

@Injectable()
export class UsersService {
    constructor(private databaseService: DatabaseService) { }
    public async findUserbyEmail(email: string) {
        const query = Query.UserQuery;
        const params = [email];
        const user = await this.databaseService.getData(query, params);

        if (user.length === 0) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user[0];
    }
}
