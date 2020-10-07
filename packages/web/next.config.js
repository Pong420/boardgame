const path = require('path');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins(
  [
    [
      optimizedImages,
      {
        optimizeImages: false,
        handleImages: ['png', 'jpeg']
      }
    ]
  ].filter(Boolean),
  {
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
      implementation: require('sass'),
      includePaths: [path.join(__dirname, 'styles')]
    }
  }
);
