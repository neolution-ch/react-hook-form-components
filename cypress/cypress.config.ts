import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    retries: {
      openMode: 0,
      runMode: 2,
    },
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
