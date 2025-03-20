import neolutionEslintConfig from "@neolution-ch/eslint-config-neolution";
import storybook from "eslint-plugin-storybook";

export default [
  {
    ignores: ["**/cypress/"],
  },
  ...neolutionEslintConfig.configs.flat["react-library"],
  ...storybook.configs["flat/recommended"],
];
