import path from 'path';
import next from 'next';
import { startBgioServer, BgioServerOptions } from './bgio-server';

interface Options extends BgioServerOptions {
  port: number;
  dev: boolean;
}

export async function startServer({ dev, port, ...bgioServerOpts }: Options) {
  const app = next({ dev, dir: path.join(__dirname, '../') });
  const handle = app.getRequestHandler();

  try {
    await app.prepare();

    const server = await startBgioServer(bgioServerOpts);

    server.router.all('*', async ctx => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    });

    server.app.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    const target = await server.run(port);

    // eslint-disable-next-line
    console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);

    return () => server.kill(target);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
