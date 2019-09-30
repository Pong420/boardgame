export { default as PATHS } from './paths.json';

export const server = process.env.REACT_APP_SERVER_PORT
  ? `localhost:${process.env.REACT_APP_SERVER_PORT}`
  : window.location.hostname;
