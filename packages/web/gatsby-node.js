// @ts-check
const path = require('path');

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

  const games = [require('@boardgame/big-two/dist/meta')];

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
      path: `/lobby/${name}`,
      context: { name },
      component: require.resolve(`./src/pages/lobby.tsx`)
    });
  });
};
