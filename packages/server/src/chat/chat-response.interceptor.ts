import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Socket } from 'socket.io';
import { map } from 'rxjs/operators';
import { isRoomMessage } from './types';

// send a message to other players in the room
export class ChatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const socket: Socket = context.switchToWs().getClient();

    return next.handle().pipe(
      map(data => {
        if (isRoomMessage(data)) {
          socket.to(data.room).emit(data.event, data.data);
          return data.data;
        }
        return data;
      })
    );
  }
}
