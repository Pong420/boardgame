const { MongoMemoryServer } = require('mongodb-memory-server');
const { startServer } = require('../web/dist/startServer');

async function init() {
  console.log('[debug]: start server');
  const mongod = new MongoMemoryServer();
  const mongoUri = await mongod.getUri();

  await startServer({
    dev: false,
    port: 3001,
    mongoUri
  });
}

init();
