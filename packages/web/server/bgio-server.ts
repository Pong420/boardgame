import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'koa-helmet';
import ratelimit from 'koa-ratelimit';
import cors from '@koa/cors';
import Koa from 'koa';
import IO from 'koa-socket-2';
import { Game } from 'boardgame.io';
import { Server } from 'boardgame.io/server';
import { MongoStore } from 'bgio-mongo';
import { Server as SocketIOServer } from 'socket.io';
import { SetupData } from '@/typings';
import { FlatFile } from './flatfile';
import { game as TicTacToe } from '../games/tic-tac-toe/game';
import { game as BigTwo } from '../games/big-two/game';
import { overrideGetMatches } from './overrideGetMatches';

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

const games = [TicTacToe, BigTwo] as Game[];

export async function startBgioServer({
  mongoUri = process.env.MONGODB_URI
}: BgioServerOptions = {}) {
  const db = mongoUri
    ? new MongoStore({
        url: mongoUri,
        preCreateGame: async ({ metadata }) => {
          const data: Partial<SetupData> | undefined = metadata.setupData;
          const validation = () => {
            if (!data) return 'SetupData is not defined';
            if (!data.matchName) return 'Missting Match Name';
          };
          const error = validation();
          if (error) throw new Error(error);
        }
      })
    : new FlatFile({
        dir: path.resolve(__dirname, './match-storage'),
        logging: false
      });

  const server = Server({ db, games });

  if (db instanceof MongoStore) {
    overrideGetMatches(server.router);
  }

  if (process.env.NODE_ENV === 'production') {
    server.app.use(cors());

    server.app.use(helmet());

    server.app.use(
      ratelimit({
        driver: 'memory',
        db: new Map(),
        duration: 60 * 1000,
        errorMessage: 'Sometimes You Just Have to Slow Down.',
        id: ctx => ctx.ip,
        headers: {
          remaining: 'Rate-Limit-Remaining',
          reset: 'Rate-Limit-Reset',
          total: 'Rate-Limit-Total'
        },
        max: 1000,
        disableHeader: false
      })
    );
  }

  return server as ReturnType<typeof Server> & {
    app: Koa & { io: IO; _io: SocketIOServer };
  };
}
