import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';
import external from 'rollup-plugin-peer-deps-external';
import autoprefixer from 'autoprefixer';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: pkg.name,
      exports: 'named',
      sourcemap: true,
      globals: {
        'vue': 'Vue',
        'lodash-es': '_'
      },
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    }
  ],
  plugins: [
    vue(),
    postcss({
      extract: 'index.css',
      plugins: [autoprefixer()]
    }),
    typescript(),
    commonjs(),
    nodeResolve({
      extensions: ['.vue', '.ts']
    }),
    external()
  ]
};
