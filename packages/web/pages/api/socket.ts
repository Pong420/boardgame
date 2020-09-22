import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { MongoStore } from 'bgio-mongo';
import { Server, SocketIO } from 'boardgame.io/server';
import { Master } from 'boardgame.io/master';
import { games } from '@/games';
import http from 'http';
// import { Transport } from 'boardgame.io/dist/types/src/client/transport/transport';

const db = new MongoStore({ url: 'mongodb://localhost:27017/boardgame' });
const server = Server({
  db,
  games,
  transport: new SocketIO({ socketOpts: { path: '/api/socket' } })
});

const connection = server.db.connect() as Promise<void>;
const t = http.createServer();
t.listen(3000);

// console.log('listener', typeof listener);

export default (req: NextApiRequest, res: NextApiResponse) => {
  // listener(req, res);
  res.send('hi');
};
