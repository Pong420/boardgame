const proxy = require('http-proxy-middleware');
const dotenv = require('dotenv');

dotenv.config({
  path: '.env.development'
});

module.exports = function(app) {
  app.use(
    proxy('/api', {
      target: `http://localhost:${process.env.REACT_APP_SERVER_PORT}`,
      pathRewrite: {
        '^/api': '/'
      }
    })
  );
};
