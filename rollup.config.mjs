import commonjs from "@rollup/plugin-commonjs";
// eslint-disable-next-line import/no-named-as-default
import nodeResolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";
import css from "rollup-plugin-import-css";

const input = "src/index.ts";

const plugins = [
  css({
    output: "styles.css",
  }),
  external({
    includeDependencies: true,
  }),
  typescript({
    clean: true,
    exclude: ["**/__tests__", "**/*.test.ts", "**/stories"],
  }),
  commonjs({
    include: /\/node_modules\//,
  }),
  nodeResolve(),
  terser({
    output: { comments: false },
    compress: {
      drop_console: false,
    },
  }),
];

export default [
  {
    input,
    output: {
      file: "dist/index.js",
      format: "cjs",
      name: "ReactHookFormComponents",
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
      interop: "auto",
    },
    plugins,
  },
  {
    input,
    output: {
      file: "dist/index.modern.js",
      format: "esm",
      name: "ReactHookFormComponents",
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
    },
    plugins,
  },
  {
    input,
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "ReactHookFormComponents",
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
    },
    plugins,
  },
];
