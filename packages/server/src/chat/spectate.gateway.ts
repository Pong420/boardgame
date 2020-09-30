import {
  SubscribeMessage,
  WebSocketGateway,
  GatewayMetadata,
  MessageBody,
  WsException,
  ConnectedSocket
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { ChatEvent, Rooms, SetupData } from '@/typings';
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
  ) {
    const { metadata } = await this.matchService.fetch(matchID, {
      metadata: true
    });

    if (!metadata) throw new WsException('Match not found');

    const { allowSpectate } = metadata.setupData as SetupData;

    if (!allowSpectate)
      throw new WsException('Spectate not allowed for this match');

    const room = this.rooms.get(matchID);

    if (!room) throw new WsException('Room is not defined');

    socket.join(matchID);

    return room.players;
  }
}
