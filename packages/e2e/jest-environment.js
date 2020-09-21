const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const PuppeteerEnvironment = require('jest-environment-puppeteer');

/**
 *  Take snapshot after test fail, reference:
 *  https://github.com/smooth-code/jest-puppeteer/issues/131#issuecomment-493267937
 */

const snapshotsDir = path.resolve(__dirname, '__snapshots');
const snapshotsSetup = (async () => {
  await new Promise((resolve, reject) => rimraf(snapshotsDir, resolve, reject));

  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir);
  }
})();

class ExtendPuppeteerEnvironment extends PuppeteerEnvironment {
  async setup() {
    this.global.snapshotsDir = snapshotsDir;
    await super.setup();
    await snapshotsSetup;
  }

  async teardown() {
    // Wait a few seconds before tearing down the page so we
    // have time to take screenshots and handle other events
    await this.global.page.waitForTimeout(2000);
    await super.teardown();
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
