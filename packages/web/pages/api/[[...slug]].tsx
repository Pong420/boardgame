import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { AppModule } from '@boardgame/server';
import { NestFactory } from '@nestjs/core';

let listener: NextApiHandler | null = null;

export async function getNestJSRequestHandler() {
  if (!listener) {
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    app.setGlobalPrefix('api');
    await app.init();
    const server = app.getHttpServer();
    [listener] = server.listeners('request') as NextApiHandler[];
  }
  return listener;
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  new Promise(async resolve => {
    listener = await getNestJSRequestHandler();
    listener(req, res);
    res.on('finish', resolve);
  });
