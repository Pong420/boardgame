import {
  SubscribeMessage,
  WebSocketGateway,
  GatewayMetadata,
  MessageBody,
  WsException,
  ConnectedSocket
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { ChatEvent, Response$Spectate, Rooms } from '@/typings';
import { MatchService } from '@/match/match.service';
import { Socket } from 'socket.io';
import { MemeoryStorage } from './memeory.providers';
import { SpectateDto } from './dto';

const PING_TIMEOUT = 20 * 1e3;
const PING_INTERVAL = 10 * 1e3;

const options: GatewayMetadata = {
  namespace: 'spectate',
  pingTimeout: PING_TIMEOUT,
  pingInterval: PING_INTERVAL
};

@WebSocketGateway(options)
export class SpectateGateway {
  constructor(
    @Inject(MatchService) private readonly matchService: MatchService,
    @Inject(MemeoryStorage.Rooms) private readonly rooms: Rooms
  ) {}

  @SubscribeMessage(ChatEvent.Spectate)
  async onSpectate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { matchID }: SpectateDto
  ): Promise<Response$Spectate> {
    const room = this.rooms.get(matchID);

    if (room) {
      socket.join(matchID);

      return {
        players: room.players,
        nextMatchID: room.nextMatchID
      };
    }

    throw new WsException('Room is not defined');
  }
}
