import fs from 'fs';
import path from 'path';
import serve from 'koa-static';
import dotenv from 'dotenv';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import { Game } from 'boardgame.io';
import { Server, FlatFile } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';

[
  '.env',
  '.env.local',
  `.env.${process.env.NODE_ENV || 'development'}`,
  `.env.${process.env.NODE_ENV || 'development'}.local`
].forEach(path => {
  try {
    const envConfig = dotenv.parse(fs.readFileSync(path));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (error) {}
});

const PORT = Number(
  process.env.REACT_APP_SERVER_PORT || process.env.PORT || 8080
);

const parsed = (process.env.DATABASE_URL || '')
  .replace('postgres://', '')
  .split(/:|@|\//);

const [username, password, host, port, database] = parsed;

const db = parsed.every(Boolean)
  ? new PostgresStore({
      username,
      password,
      host,
      port: Number(port),
      database,
      ...(!/localhost/.test(host)
        ? {
            // https://stackoverflow.com/a/27688357
            // https://stackoverflow.com/a/61350416
            dialectOptions: /localhost/.test(host)
              ? undefined
              : {
                  ssl: {
                    require: true,
                    rejectUnauthorized: false
                  }
                }
          }
        : {})
    })
  : new FlatFile({
      dir: path.resolve(__dirname, './match-storage'),
      logging: true
    });

(async () => {
  const server = Server({
    db,
    games: await Promise.all<Game>([
      import(`../../web/src/games/big-two/game`).then(p => p.game),
      import(`../../web/src/games/tic-tac-toe/game`).then(p => p.game)
    ])
  });

  const { app } = server;

  app.use(
    historyApiFallback({ index: 'index.html', whiteList: ['/api', '/games'] })
  );

  app.use(serve(path.join(__dirname, '../../web/public')));

  server.run(PORT, () => {
    // eslint-disable-next-line
    console.log(`Serving at: http://localhost:${PORT}/`);
  });
})();
