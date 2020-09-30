import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Socket } from 'socket.io';
import { map } from 'rxjs/operators';
import { isRoomMessage } from '@/typings';

// send a message to other players in the room
// https://socket.io/docs/emit-cheatsheet/
export class ChatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const socket: Socket = context.switchToWs().getClient();
    return next.handle().pipe(
      map(data => {
        if (isRoomMessage(data)) {
          const nsps = data.extraNamespaces || [];
          for (const name of nsps) {
            // sending to a specific room in a specific namespace, including sender
            socket.server.of(name).to(data.room).emit(data.event, data.data);
          }
          // sending to all clients in the room except sender
          socket.to(data.room).emit(data.event, data.data);
          return data.data;
        }
        return data;
      })
    );
  }
}
