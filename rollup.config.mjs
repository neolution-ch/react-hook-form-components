import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
      name: "ReactHookFormComponents",
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      external(),
      typescript({
        clean: true,
        exclude: ["**/__tests__", "**/*.test.ts"],
      }),
      commonjs({
        include: /\/node_modules\//,
      }),
      nodeResolve(),
      terser({
        output: { comments: false },
        compress: {
          drop_console: true,
        },
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.mjs",
      format: "esm",
      name: "ReactHookFormComponents",
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      external(),
      typescript({
        clean: true,
        exclude: ["**/__tests__", "**/*.test.ts"],
      }),
      commonjs({
        include: /\/node_modules\//,
      }),
      nodeResolve(),
      terser({
        output: { comments: false },
        compress: {
          drop_console: true,
        },
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "ReactHookFormComponents",
      sourcemap: true,
      globals: { react: "React" },
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      external(),
      typescript({
        clean: true,
        exclude: ["**/__tests__", "**/*.test.ts"],
      }),
      commonjs({
        include: /\/node_modules\//,
      }),
      nodeResolve(),
      terser({
        output: { comments: false },
        compress: {
          drop_console: true,
        },
      }),
    ],
  },
];
