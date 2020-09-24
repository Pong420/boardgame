import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { startServer } from './startServer';

const dev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT) || 3000;

[
  '.env',
  '.env.local',
  `.env.${process.env.NODE_ENV || 'development'}`,
  `.env.${process.env.NODE_ENV || 'development'}.local`
].forEach(filiname => {
  try {
    const envConfig = dotenv.parse(
      fs.readFileSync(path.resolve(__dirname, '../', filiname))
    );
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (error) {}
});

startServer({ dev, port, mongoUri: process.env.MONGODB_URI });
