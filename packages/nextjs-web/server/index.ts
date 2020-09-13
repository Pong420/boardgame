import path from 'path';
import next from 'next';
import { bgioServer } from './bgio-server';
import { game as TicTacToe } from '../games/tic-tac-toe/game';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, '../') });
const handle = app.getRequestHandler();
const port = Number(process.env.PORT) || 3000;

(async () => {
  try {
    const games = [TicTacToe];

    await app.prepare();
    const server = bgioServer(games);

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
