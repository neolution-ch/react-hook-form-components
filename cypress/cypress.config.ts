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

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  }
});
