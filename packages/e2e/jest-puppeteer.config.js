module.exports = {
  launch: {
    // If true disable ui
    headless: process.env.CI === 'true' || process.env.HEADLESS !== 'false',
    defaultViewport: null,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox']
  },
  server: {
    command: 'node server.js',
    port: 3001
  },
  exitOnPageError: false
};
