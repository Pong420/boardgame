// @ts-check
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import esbuild from 'rollup-plugin-esbuild';
import styles from 'rollup-plugin-styles';
import serve from 'rollup-plugin-serve';
import pkg from './package.json';

function onwarn(warning, rollupWarn) {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
}

/** @type {import('rollup').RollupOptions['plugins']} */
const plugins = [
  json(),
  image(),
  styles({
    sass: {
      data: `@import "~@boardgame/scss/index.scss";`
    }
  }),
  nodeResolve({ browser: true }),
  commonjs(),
  esbuild({
    // @ts-ignore
    watch: !!process.env.ROLLUP_WATCH,
    target: 'esnext',
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
const productionInput = [
  './src/meta.ts',
  './src/game/index.ts',
  './src/board/index.ts'
].map(input => ({
  input,
  output: {
    file: input.replace('src', 'dist').replace('.ts', '.js'),
    format: 'cjs',
    strict: false
  },
  plugins,
  onwarn,
  external: ['react', 'react-dom']
}));

/** @type {import('rollup').RollupOptions[]} */
const config =
  process.env.NODE_ENV === 'production'
    ? productionInput
    : [
        {
          input: './src/app.tsx',
          output: {
            file: './dist/app.js',
            format: 'umd',
            strict: false
          },
          plugins: [
            replace({
              'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }),
            ...plugins,
            serve({
              contentBase: ['']
            })
          ],
          onwarn
        }
      ];

export default config;
