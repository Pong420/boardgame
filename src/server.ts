import fs from 'fs';
import path from 'path';
import serve from 'koa-static';
import dotenv from 'dotenv';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import { Server, Mongo } from 'boardgame.io/server';
import { BigTwo } from './games/BigTwo/game';

dotenv.config();

try {
  ['.env.local', '.env.development'].forEach(path => {
    const envConfig = dotenv.parse(fs.readFileSync(path));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  });
} catch (e) {}

const { REACT_APP_SERVER_PORT, MONGODB_URI = '' } = process.env;

const PORT = REACT_APP_SERVER_PORT || process.env.PORT || 8080;
const server = Server({
  games: [BigTwo],
  db: new Mongo({
    url: MONGODB_URI,
    dbname: MONGODB_URI.replace(/^.*\//, '')
  })
});
const { app } = server;

const root = path.join(__dirname, '../');

app.use(
  historyApiFallback({ index: 'index.html', whiteList: ['/api', '/games'] })
);

app.use(serve(root));

server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`);
});
