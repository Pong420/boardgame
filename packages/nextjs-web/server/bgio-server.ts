import path from 'path';
import helmet from 'koa-helmet';
import ratelimit from 'koa-ratelimit';
import { Server } from 'boardgame.io/server';
import { MongoStore } from 'bgio-mongo';
import { FlatFile } from './flatfile';
import { game as TicTacToe } from '../games/tic-tac-toe/game';
import { overrideGetMatches } from './overrideGetMatches';

const db = process.env.MONGODB_URL
  ? new MongoStore({
      url: process.env.MONGODB_URL,
      dbName: 'boardgame'
    })
  : new FlatFile({
      dir: path.resolve(__dirname, './match-storage'),
      logging: true
    });

const games = [TicTacToe];

export const server = Server({ db, games });

if (db instanceof MongoStore) {
  overrideGetMatches(server.router);
}

if (process.env.NODE_ENV === 'production') {
  server.app.use(helmet());

  server.app.use(
    ratelimit({
      driver: 'memory',
      db: new Map(),
      duration: 60000,
      errorMessage: 'Sometimes You Just Have to Slow Down.',
      id: ctx => ctx.ip,
      headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total'
      },
      max: 100,
      disableHeader: false
    })
  );
}
