module.exports = {
  launch: {
    // If true disable ui
    headless: process.env.HEADLESS !== 'false' && process.env.CI !== 'true',
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  },
  exitOnPageError: false
};
