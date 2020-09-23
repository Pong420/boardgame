import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Koa from 'koa';
import IO from 'koa-socket-2';
import { Game } from 'boardgame.io';
import { Server } from 'boardgame.io/server';
import { MongoStore } from 'bgio-mongo';
import { Server as SocketIOServer } from 'socket.io';
import { FlatFile } from './flatfile';
import { game as TicTacToe } from '../games/tic-tac-toe/game';
import { game as BigTwo } from '../games/big-two/game';

export interface BgioServerOptions {
  mongoUri?: string;
}

[
  '.env',
  '.env.local',
  `.env.${process.env.NODE_ENV || 'development'}`,
  `.env.${process.env.NODE_ENV || 'development'}.local`
].forEach(filiname => {
  try {
    const envConfig = dotenv.parse(
      fs.readFileSync(path.resolve(__dirname, '../', filiname))
    );
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (error) {}
});

export const games = [TicTacToe, BigTwo] as Game[];

export async function startBgioServer({
  mongoUri = process.env.MONGODB_URI
}: BgioServerOptions = {}) {
  const db = mongoUri
    ? new MongoStore({ url: mongoUri })
    : new FlatFile({
        dir: path.resolve(__dirname, './match-storage'),
        logging: false
      });

  const server = Server({ db, games });

  // remove all default routes
  server.router.stack = [];

  return server as ReturnType<typeof Server> & {
    app: Koa & { io: IO; _io: SocketIOServer };
  };
}
