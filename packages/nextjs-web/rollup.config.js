// @ts-check
/* eslint-disable @typescript-eslint/ban-ts-comment */
import esbuild from 'rollup-plugin-esbuild';
import run from '@rollup/plugin-run';

function onwarn(warning, rollupWarn) {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
}

const watch = process.env.ROLLUP_WATCH === 'true';

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('rollup').RollupOptions[]} */
const config = [
  {
    input: './server/index.ts',
    output: {
      dir: './dist',
      format: 'cjs'
    },
    onwarn,
    plugins: [
      esbuild({
        // @ts-ignore
        watch,
        tsconfig: './tscofnig.server.json',
        target: 'es2017',
        include: /\.[jt]sx?$/,
        minify: isProduction,
        loaders: {
          '.json': 'json',
          '.js': 'jsx'
        }
      }),
      watch && run()
    ]
  }
];

export default config;
