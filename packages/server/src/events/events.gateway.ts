import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { Type, mixin, Provider } from '@nestjs/common';

export function createEventGateway(namespace: string): Type<Provider> {
  console.log('namespace', namespace);

  @WebSocketGateway({ namespace })
  class EventsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('sync')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
      console.log('SubscribeMessage', 'sync');
      return from([1, 2, 3]).pipe(
        map(item => ({ event: 'events', data: item }))
      );
    }

    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
      return data;
    }
  }

  return mixin(EventsGateway);
}
