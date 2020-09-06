// @ts-check
const React = require('react');
const { Layout } = require('./src/components/Layout');

/** @type {import('gatsby').GatsbySSR['wrapPageElement']} */
exports.wrapPageElement = async ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
