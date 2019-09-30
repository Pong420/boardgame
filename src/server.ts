import path from 'path';
import serve from 'koa-static';
import dotenv from 'dotenv';
import { Server } from 'boardgame.io/server';
import { BigTwo } from './game';

dotenv.config({
  path: '.env.development'
});

const PORT = process.env.REACT_APP_SERVER_PORT || process.env.PORT || 8080;
const server = Server({ games: [BigTwo] });
const { app } = server;

const root = path.join(__dirname, '../build');

app.use(serve(root));

server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`);
});
