// @ts-check
const React = require('react');
const { Layout } = require('./src/components/Layout');

/** @type {import('gatsby').GatsbyBrowser['wrapPageElement']} */
exports.wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
