import path from 'path';
import helmet from 'koa-helmet';
import ratelimit from 'koa-ratelimit';
import { Game } from 'boardgame.io';
import { Server } from 'boardgame.io/server';
import { MongoStore } from 'bgio-mongo';
import { FlatFile } from './flatfile';

const db = process.env.MONGODB_URL
  ? new MongoStore({
      url: process.env.MONGODB_URL
    })
  : new FlatFile({
      dir: path.resolve(__dirname, './match-storage'),
      logging: true
    });

export function bgioServer(games: Game[]): ReturnType<typeof Server> {
  const server = Server({
    db,
    games
  });

  const { app } = server;

  app.use(helmet());

  if (process.env.NODE_ENV === 'production') {
    app.use(
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

  return server;
}
