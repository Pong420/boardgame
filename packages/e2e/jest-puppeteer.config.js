module.exports = {
  launch: {
    // If true disable ui
    headless: process.env.CI === 'true' || process.env.HEADLESS !== 'false',
    defaultViewport: null,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox']
  },
  exitOnPageError: false
};
