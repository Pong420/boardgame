import fs from 'fs';
import dotenv from 'dotenv';
import { Server, Mongo } from 'boardgame.io/server';

import BigTwo from './src/Game/BigTwo/game';

dotenv.config();

try {
  const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
  for (let k in envConfig) {
    process.env[k] = envConfig[k];
  }
} catch (e) {}

const { $PORT, MONGODB_URI, REACT_APP_REMOTE_SERVER_PORT } = process.env;
const PORT = Number($PORT || REACT_APP_REMOTE_SERVER_PORT);

const serverConifg = {
  games: [BigTwo]
};

if (MONGODB_URI) {
  Object.assign(serverConifg, {
    db: new Mongo({
      url: MONGODB_URI,
      dbname: MONGODB_URI.replace(/^.*\//, '')
    })
  });
}

const server = Server(serverConifg);

server.run(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
