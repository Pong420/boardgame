module.exports = {
  launch: {
    // If true disable ui
    headless: process.env.HEADLESS === 'false' ? false : true,
    defaultViewport: null
  },
  exitOnPageError: false
};
