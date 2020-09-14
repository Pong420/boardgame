import path from 'path';
import next from 'next';
import { server } from './bgio-server';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, '../') });
const handle = app.getRequestHandler();
const port = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await app.prepare();

    server.router.all('*', async ctx => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    });

    server.app.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    server.run(port, (err?: any) => {
      if (err) throw err;
      // eslint-disable-next-line
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
