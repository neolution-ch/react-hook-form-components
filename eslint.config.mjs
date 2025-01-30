import neolutionEslintConfig from "@neolution-ch/eslint-config-neolution";
import storybook from "eslint-plugin-storybook";

export default [
  {
    ignores: ["**/cypress/"],
  },
  ...neolutionEslintConfig.configs.flat.nextjs,
  ...storybook.configs["flat/recommended"],
];
