import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebsocketService {
    private logger: Logger = new Logger('WebsocketService');
}
