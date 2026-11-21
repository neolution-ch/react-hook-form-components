import neolutionEslintConfig from "@neolution-ch/eslint-config-neolution";
import storybook from "eslint-plugin-storybook";

export default [
  {
    // scripts/ holds release tooling taken from the release playbook and kept in sync with it.
    ignores: ["**/cypress/", "**/storybook-static/", "scripts/"],
  },
  ...neolutionEslintConfig.configs.flat["react-library"],
  ...storybook.configs["flat/recommended"],
  {
    files: [".storybook/**/*.ts", ".storybook/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
  },
];
