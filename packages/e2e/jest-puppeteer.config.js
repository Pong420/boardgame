module.exports = {
  launch: {
    // If true disable ui
    headless: process.env.HEADLESS !== 'false' && process.env.CI !== 'true',
    defaultViewport: null,
    executablePath:
      process.env.CI === 'true' ? '/usr/bin/chromium-browser' : undefined,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox']
  },
  exitOnPageError: false
};
