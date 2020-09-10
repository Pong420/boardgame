// @ts-check
/* eslint-disable @typescript-eslint/ban-ts-comment */
import esbuild from 'rollup-plugin-esbuild';
import run from '@rollup/plugin-run';

function onwarn(warning, rollupWarn) {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
}

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
        watch: !!process.env.ROLLUP_WATCH,
        target: 'es2017',
        include: /\.[jt]sx?$/,
        minify: process.env.NODE_ENV === 'production',
        loaders: {
          '.json': 'json',
          '.js': 'jsx'
        }
      }),
      run()
    ]
  }
];

export default config;
