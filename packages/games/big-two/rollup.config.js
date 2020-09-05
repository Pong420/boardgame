import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import scss from 'rollup-plugin-scss';
import pkg from './package.json';

const plugins = [
  json(),
  image(),
  commonjs(),
  scss({
    sass: require('sass')
  }),
  esbuild({
    include: /\.[jt]sx?$/,
    watch: !!process.env.ROLLUP_WATCH,
    minify: process.env.NODE_ENV === 'production',
    define: {
      __VERSION__: `"${pkg.version}"`
    },
    loaders: {
      '.json': 'json',
      '.js': 'jsx'
    }
  })
];

export default [
  {
    input: './src/meta.ts',
    output: {
      file: './dist/meta.js',
      format: 'cjs'
    },
    plugins
  },
  {
    input: './src/game/index.ts',
    output: {
      file: './dist/game/index.js',
      format: 'cjs'
    },
    plugins
  },
  {
    input: './src/board/index.ts',
    output: {
      file: './dist/board/index.js',
      format: 'cjs'
    },
    plugins
  }
];
