// @ts-check
const { createProxyMiddleware } = require('http-proxy-middleware');

/** @type {import('gatsby').GatsbyConfig} */
module.exports = {
  siteMetadata: {
    title: `Boardgame`,
    description: `let's play boardgame`,
    author: `@Pong420`
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        data: `@import './src/scss/index.scss';`,
        implementation: require('sass')
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /assets/ // See below to configure properly
        }
      }
    }
  ],
  developMiddleware: app => {
    app.use(
      createProxyMiddleware('/api', {
        target: `http://localhost:8080`,
        pathRewrite: {
          '^/api': '/'
        }
      })
    );
  }
};
