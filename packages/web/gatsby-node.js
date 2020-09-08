// @ts-check
const path = require('path');

const games = [
  require('@boardgame/big-two/dist/meta'),
  require('@boardgame/tic-tac-toe/dist/meta')
];

/** @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']} */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  });
};

exports.sourceNodes = props => {
  /** @type {import('gatsby').SourceNodesArgs} */
  const { actions, createNodeId, createContentDigest } = props;

  return games.map(({ meta }) =>
    actions.createNode({
      ...meta,
      id: createNodeId(meta.name),
      internal: {
        type: `GameMeta`,
        contentDigest: createContentDigest(meta)
      }
    })
  );
};

/** @type {import('gatsby').GatsbyNode['createPages']} */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const result = await graphql(`
    query {
      allGameMeta {
        nodes {
          name
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }
  /** @type {Array<{ name: string }>} */
  const nodes = result.data.allGameMeta.nodes;
  nodes.forEach(({ name }) => {
    actions.createPage({
      path: `/lobby/${name}/`,
      context: { name },
      component: require.resolve(`./src/pages/lobby.tsx`)
    });

    actions.createPage({
      path: `/match/${name}/`,
      context: { name },
      component: require.resolve(`./src/pages/match.tsx`)
    });

    actions.createPage({
      path: `/spectate/${name}/*`,
      matchPath: `/spectate/${name}/:matchName/:matchID/`,
      context: { name },
      component: require.resolve(`./src/pages/spectate.tsx`)
    });
  });

  actions.createPage({
    path: `/error/*`,
    matchPath: `/error/:message`,
    context: {},
    component: require.resolve(`./src/pages/error.tsx`)
  });
};
