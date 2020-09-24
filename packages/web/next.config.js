const path = require('path');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

// TODO: check is this required
const withTM = require('next-transpile-modules')(['@boardgame/server']);

module.exports = withPlugins(
  [
    process.env.NODE_ENV === 'development' && withTM,
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
