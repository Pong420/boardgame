const path = require('path');
const packageImporter = require('node-sass-package-importer');

module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      'next/babel',
      {
        'styled-jsx': {
          plugins: [
            [
              path.resolve(__dirname, './styled-jsx-plugin-sass.js'),
              {
                sassOptions: {
                  data: `@import './styles/scss/index';`,
                  includePaths: [path.resolve(__dirname, './styles')],
                  importer: packageImporter()
                }
              }
            ]
          ]
        }
      }
    ]
  ];
  const plugins = [];

  return {
    presets,
    plugins
  };
};
