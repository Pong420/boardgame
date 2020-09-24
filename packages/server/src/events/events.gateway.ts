import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket
} from '@nestjs/websockets';
import { Type, mixin, Provider, Inject } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PlayerID, Game } from 'boardgame.io';
import { Master } from 'boardgame.io/master';
import { MatchService } from '@/match/match.service';

type MasterTransport = Master['transportAPI'];

/**
 * API that's exposed by SocketIO for the Master to send
 * information to the clients.
 */
export function TransportAPI(
  matchID: string,
  socket,
  clientInfo: Map<any, any>,
  roomInfo: Map<any, any>
): MasterTransport {
  /**
   * Send a message to a specific client.
   */
  const send: MasterTransport['send'] = ({ type, playerID, args }) => {
    const clients = roomInfo.get(matchID).values();
    for (const client of clients) {
      const info = clientInfo.get(client);
      if (String(info.playerID) === playerID) {
        if (String(socket.id) === String(client)) {
          socket.emit.apply(socket, [type, ...args]);
        } else {
          socket.to(info.socket.id).emit.apply(socket, [type, ...args]);
        }
      }
    }
  };

  /**
   * Send a message to all clients.
   */
  const sendAll: MasterTransport['sendAll'] = makePlayerData => {
    roomInfo.get(matchID).forEach(c => {
      const playerID: PlayerID = clientInfo.get(c).playerID;
      const data = makePlayerData(playerID);
      send({ playerID, ...data });
    });
  };

  return { send, sendAll };
}

const clientInfo = new Map<any, any>();
const roomInfo = new Map<any, any>();

export function createEventGateway(game: Game): Type<Provider> {
  @WebSocketGateway({ namespace: game.name })
  class EventsGateway {
    constructor(
      @Inject(MatchService) private readonly matchService: MatchService
    ) {}

    @SubscribeMessage('sync')
    async onSync(
      @ConnectedSocket() socket: Socket,
      @MessageBody() body: Parameters<Master['onSync']>
    ) {
      const [matchID, playerID, numPlayers] = body;
      socket.join(matchID);

      // Remove client from any previous game that it was a part of.
      if (clientInfo.has(socket.id)) {
        const { matchID: oldMatchID } = clientInfo.get(socket.id);
        roomInfo.get(oldMatchID).delete(socket.id);
      }

      let roomClients = roomInfo.get(matchID);
      if (roomClients === undefined) {
        roomClients = new Set();
        roomInfo.set(matchID, roomClients);
      }
      roomClients.add(socket.id);

      clientInfo.set(socket.id, { matchID, playerID, socket });

      const master = new Master(
        game,
        this.matchService,
        TransportAPI(matchID, socket, clientInfo, roomInfo)
        // this.auth
      );

      await master.onSync(matchID, playerID, numPlayers);
    }

    @SubscribeMessage('update')
    async onUpdate(
      @ConnectedSocket() socket: Socket,
      @MessageBody() body: Parameters<Master['onUpdate']>
    ) {
      const [action, stateID, matchID, playerID] = body;
      const master = new Master(
        game,
        this.matchService,
        TransportAPI(matchID, socket, clientInfo, roomInfo)
        // this.auth
      );
      await master.onUpdate(action, stateID, matchID, playerID);
    }

    @SubscribeMessage('disconnect')
    async onDisconnect(@ConnectedSocket() socket: Socket) {
      if (clientInfo.has(socket.id)) {
        const { matchID } = clientInfo.get(socket.id);
        roomInfo.get(matchID).delete(socket.id);
        clientInfo.delete(socket.id);
      }
    }
  }

  return mixin(EventsGateway);
}
