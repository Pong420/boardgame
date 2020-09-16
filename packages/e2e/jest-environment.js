const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const PuppeteerEnvironment = require('jest-environment-puppeteer');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { startServer } = require('../web/dist/startServer');
const mongoose = require('mongoose');

/**
 *  Take snapshot after test fail, reference:
 *  https://github.com/smooth-code/jest-puppeteer/issues/131#issuecomment-493267937
 */

const snapshotsDir = path.resolve(__dirname, '__snapshots');

class ExtendPuppeteerEnvironment extends PuppeteerEnvironment {
  mongod = new MongoMemoryServer();

  async setup() {
    await super.setup();
    await this.setupSnapshot();
    await this.setupMongoMemoryServer();
  }

  async setupSnapshot() {
    await new Promise((resolve, reject) =>
      rimraf(snapshotsDir, resolve, reject)
    );

    if (!fs.existsSync(snapshotsDir)) {
      fs.mkdirSync(snapshotsDir);
    }
  }

  async setupMongoMemoryServer() {
    const mongoUri = await this.mongod.getUri();
    this.stopDevServer = await startServer({
      dev: false,
      port: 3000,
      mongoUri
    });
  }

  async teardown() {
    try {
      // Wait a few seconds before tearing down the page so we
      // have time to take screenshots and handle other events
      await this.global.page.waitFor(2000);
      await super.teardown();

      await mongoose.connection.close();

      await this.mongod.stop();

      this.stopDevServer();
    } catch (error) {
      console.log(error);
    }
  }
  // `jest-circus` features
  // https://github.com/facebook/jest/tree/master/packages/jest-circus
  async handleTestEvent(event, state) {
    if (event.name === 'test_fn_failure') {
      const testName = state.currentlyRunningTest.name;
      await this.global.page.screenshot({
        path: path.resolve(snapshotsDir, `${testName}.png`)
      });
    }
  }
}

module.exports = ExtendPuppeteerEnvironment;
