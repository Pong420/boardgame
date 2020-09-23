import path from 'path';
import next, { NextApiHandler } from 'next';
import { NestFactory } from '@nestjs/core';
import { startBgioServer, BgioServerOptions, games } from './bgio-server';
import { AppModule, setupApp } from '@boardgame/server';
import { NestModule, MiddlewareConsumer, NestMiddleware } from '@nestjs/common';

interface Options extends BgioServerOptions {
  port: number;
  dev: boolean;
}

export async function startServer({ dev, port }: Options) {
  const app = next({ dev, dir: path.join(__dirname, '../') });
  const handle = app.getRequestHandler();

  try {
    await app.prepare();

    const nestjs = await NestFactory.create(AppModule.init(games));

    setupApp(nestjs as any);

    nestjs.use((req: any, res: any, next: () => void) => {
      if (req.url.startsWith('/api')) {
        next();
      } else {
        return handle(req, res);
      }
    });

    console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);

    await nestjs.listen(port);

    return () => {
      nestjs.close();
    };
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
