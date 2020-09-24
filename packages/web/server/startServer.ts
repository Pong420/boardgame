import path from 'path';
import next from 'next';
import { Game } from 'boardgame.io';
import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule, setupApp } from '@boardgame/server';
import { game as TicTacToe } from '../games/tic-tac-toe/game';
import { game as BigTwo } from '../games/big-two/game';

interface Options {
  port: number;
  dev: boolean;
  mongoUri?: string;
}

const games = [TicTacToe, BigTwo] as Game[];

export async function startServer({
  dev,
  port,
  mongoUri = process.env.MONGODB_URI
}: Options) {
  const nextApp = next({ dev, dir: path.join(__dirname, '../') });
  const handle = nextApp.getRequestHandler();

  try {
    await nextApp.prepare();

    if (mongoUri) {
      const nest = await NestFactory.create<NestApplication>(
        AppModule.init({ games, mongoUri })
      );

      setupApp(nest);

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
