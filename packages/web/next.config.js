const path = require('path');

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/
      },
      use: ['@svgr/webpack']
    });

    return config;
  },
  cssModules: true,
  sassLoaderOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  }
};
