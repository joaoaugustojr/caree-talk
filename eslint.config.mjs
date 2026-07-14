import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // External packages (and side-effect package imports)
            ["^\\u0000", "^node:", "^@?\\w"],
            // App aliases
            ["^@/"],
            // Relative imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$", "^\\./(?!.+\\.(s?css|sass|less)$)", "^\\./?$"],
            // Style side-effects
            ["^.+\\.(s?css|sass|less)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  eslintConfigPrettier,
]);

export default eslintConfig;
