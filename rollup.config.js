import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import server from 'rollup-plugin-serve';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import typescript from 'rollup-plugin-typescript2';
let defaults = { compilerOptions: { declaration: true } };
let override = { compilerOptions: { declaration: false } };

export default {
  input: "src/index.ts",
  output: {
    
    file: "output/bundle.umd.js",
    sourcemap: true,
    name: "performance",
    format: "umd"
  },
  plugins: [
    resolve(),
    commonjs(),
    // typescript
    typescript({
      tsconfigDefaults: defaults,
      tsconfig: "tsconfig.json",
      tsconfigOverride: override
    }),
    // babel转换es语法.
    babel({
      exclude: 'node_modules/**'
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
    (process.env.NODE_ENV === 'developer' && server({open: false, contentBase: './', historyApiFallback: true, host: 'localhost', port: 8000 }))
  ]
}