import eslintPluginSvelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import typeScriptEslint from "typescript-eslint";

export default [
  ...eslintPluginSvelte.configs["flat/recommended"],
  ...typeScriptEslint.configs.strictTypeChecked,
  ...eslintPluginSvelte.configs["flat/prettier"],
  {
    languageOptions: {
      parser: typeScriptEslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
        ecmaVersion: 2020,
        sourceType: "module",
        project: true,
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: typeScriptEslint.parser,
      },
    },
    ignores: [
      ".DS_Store",
      "node_modules",
      "build",
      ".svelte-kit",
      "package",
      ".env",
      ".env.*",
      "!.env.example",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
    ],
  },
];
