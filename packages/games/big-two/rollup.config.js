import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';

const plugins = [
  json(),
  commonjs(),
  scss({
    sass: require('sass')
  }),
  esbuild({
    include: /\.[jt]sx?$/,
    watch: !!process.env.ROLLUP_WATCH,
    minify: process.env.NODE_ENV === 'production',
    loaders: {
      '.json': 'json',
      '.js': 'jsx'
    }
  })
];

export default [
  {
    input: './src/game/index.ts',
    output: {
      file: './dist/game/index.js',
      format: 'commonjs'
    },
    plugins
  },
  {
    input: './src/board/index.ts',
    output: {
      file: './dist/board/index.js',
      format: 'commonjs'
    },
    plugins
  }
];
