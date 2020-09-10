// @ts-check
const path = require('path');

/** @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']} */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    // seems not work, but leave here
    devServer: {
      watchOptions: {
        ignored: [
          path.resolve(__dirname, '../games/src'),
          path.resolve(__dirname, '../server')
        ]
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  });
};

/** @type {import('gatsby').GatsbyNode['onCreatePage']} */
exports.onCreatePage = ({ page, actions }) => {
  if (page.path.match(/^\/lobby/)) {
    page.matchPath = '/lobby/:name';
    actions.createPage(page);
  }

  if (page.path.match(/^\/match/)) {
    page.matchPath = '/match/:name';
    actions.createPage(page);
  }

  if (page.path.match(/^\/spectate/)) {
    page.matchPath = '/spectate/*';
    actions.createPage(page);
  }

  if (page.path.match(/^\/error/)) {
    page.matchPath = '/error/:message';
    actions.createPage(page);
  }
};
