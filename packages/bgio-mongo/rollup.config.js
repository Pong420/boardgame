// @ts-check
/* eslint-disable @typescript-eslint/ban-ts-comment */
import esbuild from 'rollup-plugin-esbuild';

function onwarn(warning, rollupWarn) {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
}

const watch = process.env.ROLLUP_WATCH === 'true';

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    input: './src/index.ts',
    output: {
      dir: './dist',
      format: 'cjs'
    },
    onwarn,
    plugins: [
      esbuild({
        // @ts-ignore
        watch,
        target: 'es2017',
        include: /\.[jt]sx?$/,
        loaders: {
          '.json': 'json',
          '.js': 'jsx'
        }
      })
    ],
    external: ['boardgame.io/internal', 'mongoose']
  }
];

export default config;
