// @ts-check
/* eslint-disable @typescript-eslint/ban-ts-comment */
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import styles from 'rollup-plugin-styles';
import pkg from './package.json';

/** @type {import('rollup').RollupOptions['plugins']} */
const plugins = [
  json(),
  image(),
  styles({
    sass: {
      data: `@import "~@boardgame/scss/index.scss";`
    }
  }),
  commonjs(),
  esbuild({
    // @ts-ignore
    watch: !!process.env.ROLLUP_WATCH,
    include: /\.[jt]sx?$/,
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

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    input: './src/meta.ts',
    output: {
      exports: 'auto',
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

export default config;
