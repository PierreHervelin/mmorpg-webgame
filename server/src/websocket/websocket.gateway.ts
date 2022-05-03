import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';
import { WebsocketEvents } from 'src/common/constant';
import { IPlayerAction } from './websocket.interface';
import { WebsocketService } from './websocket.service';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('WebsocketGateway');
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private websocketService: WebsocketService) {}

    afterInit(server: Server) {
        this.logger.log('websocket server initialized');
    }
    async handleConnection(client: Socket, playerId: string) {
        await this.cacheManager.set(client.id, playerId, { ttl: 0 });
        this.logger.log(`client ${client.id} connected`);
    }
    async handleDisconnect(client: Socket) {
        const cacheClient = await this.cacheManager.get(client.id);
        if (cacheClient) await this.cacheManager.del(client.id);
        this.logger.log(`client ${client.id} disconnected`);
    }

    @SubscribeMessage(WebsocketEvents.PlayerAction)
    handleMessage(client: Socket, action: IPlayerAction): WsResponse<string> {
        switch (action.type) {
            default:
                this.logger.warn(`client ${client.id} wrong action type: ${action.type}`);
                return { event: WebsocketEvents.PlayerAction, data: 'invalid type' };
        }
    }
}
