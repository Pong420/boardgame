require('typeface-muli');
require('normalize.css');
require('@blueprintjs/core/lib/css/blueprint.css');
require('@blueprintjs/icons/lib/css/blueprint-icons.css');

const React = require('react');
const { Layout } = require('./src/components/Layout');
const { PreferencesProvider } = require('./src/services/preferences');
const { GameMetaProvider } = require('./src/store/gameMeta');

// @ts-check

/** @type {import('gatsby').GatsbyBrowser['wrapPageElement']} */
exports.wrapPageElement = ({ element, props }) => {
  return (
    <PreferencesProvider>
      <GameMetaProvider>
        <Layout {...props}>{element}</Layout>
      </GameMetaProvider>
    </PreferencesProvider>
  );
};
