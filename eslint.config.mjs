import neolutionEslintConfig from "@neolution-ch/eslint-config-neolution";
import storybook from "eslint-plugin-storybook";

export default [
  {
    ignores: ["**/cypress/", "**/storybook-static/"],
  },
  ...neolutionEslintConfig.configs.flat["react-library"],
  ...storybook.configs["flat/recommended"],
];
