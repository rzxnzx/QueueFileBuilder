import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
    public getCurrentDateTime() {
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();

        return `${formattedDate}, ${formattedTime}`;
    }
}
