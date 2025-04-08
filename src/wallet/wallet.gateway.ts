import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/wallets', transports: ['websocket', 'polling'], path: '/socket.io/' })
export class WalletGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    console.log(`Client namespace: ${client.nsp.name}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitWalletDetailAdded(detail: any) {
    this.server.emit('walletDetailAdded', detail);
  }

  emitWalletUserIndex(text: any) {
    this.server.emit('walletUserIndex', text);
  }
}