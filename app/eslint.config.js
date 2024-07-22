// @ts-check
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import ts from "typescript-eslint";
import globals from "globals";

/** @type {import('typescript-eslint').Config} */
export default ts.config(
  ...ts.configs.recommendedTypeChecked,
  ...svelte.configs["flat/recommended"],
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
      parserOptions: {
        project: true,
        parser: ts.parser,
        extraFileExtensions: [".svelte"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.svelte", "*.svelte"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parser: svelteParser,
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: [".svelte"],
      },
    },
    rules: {
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      "svelte/no-target-blank": "error",
      "svelte/no-at-debug-tags": "error",
      "svelte/no-reactive-functions": "error",
      "svelte/no-reactive-literals": "error",
    },
  },
  {
    rules: {
      semi: ["warn", "always"],
      "no-nested-ternary": "error",
      "linebreak-style": ["error", "unix"],
      "no-cond-assign": ["error", "always"],
      // TODO: Fix ts linting
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
  {
    files: ["**/*.config.*"],
    extends: [ts.configs.disableTypeChecked],
  },
  {
    ignores: [
      "coverage",
      "**/dist",
      "**/build",
      "**/package",
      "**/.svelte-kit",
      "**/node_modules",
      ".env",
      ".env.*",
      "!*.cjs",
      ".DS_Store",
      "!.env.example",
      "pnpm-lock.yaml",
      "package-lock.json",
      "**/database.model.ts",
    ],
  }
);
