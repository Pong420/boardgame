import { startServer } from './startServer';

const dev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT) || 3000;

startServer({ dev, port });
