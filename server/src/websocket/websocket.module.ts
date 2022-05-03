import { CacheModule, Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
    imports: [CacheModule.register()],
    providers: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
