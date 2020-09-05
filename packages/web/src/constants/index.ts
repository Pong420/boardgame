export { default as PATHS } from './paths.json';

export const server = process.env.REACT_APP_SERVER_PORT
  ? `http://localhost:${process.env.REACT_APP_SERVER_PORT}`
  : window.location.origin;
