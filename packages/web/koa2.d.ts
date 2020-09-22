// eslint-disable-next-line
import { Application } from 'koa';
import { IO } from 'koa2-socket';
import { Server as SocketIOServer } from 'socket.io';

declare module 'koa' {
  interface Application {
    io: IO;
    _io: SocketIOServer;
  }
}
