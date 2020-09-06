// @ts-check
const React = require('react');
const { Layout } = require('./src/components/Layout');

exports.wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
