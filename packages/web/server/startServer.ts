import path from 'path';
import next from 'next';
import { Game } from 'boardgame.io';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule, setupApp } from '@boardgame/server';
import { game as TicTacToe } from '../games/tic-tac-toe/game';
import { game as BigTwo } from '../games/big-two/game';
import rateLimit from 'fastify-rate-limit';
import helmet from 'fastify-helmet';
import compression from 'fastify-compress';

interface Options {
  port: number;
  dev: boolean;
  mongoUri?: string;
}

const games = [TicTacToe, BigTwo] as Game[];

export async function startServer({ dev, port, mongoUri }: Options) {
  const nextApp = next({ dev, dir: path.join(__dirname, '../') });
  const handle = nextApp.getRequestHandler();

  try {
    await nextApp.prepare();

    if (mongoUri) {
      const nest = await NestFactory.create<NestFastifyApplication>(
        AppModule.init({ games, mongoUri }),
        new FastifyAdapter()
      );

      setupApp(nest);

      nest.register(compression, { encodings: ['gzip', 'deflate'] });
      nest.register(helmet);
      nest.register(rateLimit, {
        max: 100,
        timeWindow: 5 * 60 * 1000
      });

      nest.use((req: any, res: any, next: () => void) => {
        if (req.url.startsWith('/api')) {
          next();
        } else {
          return handle(req, res);
        }
      });

      await nest.listen(port, '0.0.0.0');

      // eslint-disable-next-line
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);

      return () => {
        nest.close();
      };
    }

    throw new Error(`mongoUri is not defined`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
