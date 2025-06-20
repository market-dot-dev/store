// @ts-check
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier/recommended";
import tailwind from "eslint-plugin-tailwindcss";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

const config = ts.config(
  // ...compat.extends("next", "next/core-web-vitals"),

  globalIgnores([
    "**/node_modules",
    "**/out",
    "**/.next",
    "app/generated/prisma/",
    "public/embed.js",
    "postcss.config.js",
    "eslint.config.mjs"
  ]),

  // ESlint
  js.configs.recommended,
  // TSESlint
  ts.configs.recommended,
  // jsxA11y
  jsxA11y.flatConfigs.recommended,
  // Tailwindcss
  ...tailwind.configs["flat/recommended"],
  // Prettier
  prettier,
  {
    plugins: {
      "@next/next": nextPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node
      },

      ecmaVersion: 2024,
      sourceType: "module",

      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.test.json"],
        tsconfigRootDir: "."
      }
    },

    settings: {
      tailwindcss: {
        config: "./tailwind.config.ts",
        plugins: ["tailwindcss-animate"]
      }
    },

    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          printWidth: 100,
          tabWidth: 2,
          trailingComma: "none",
          bracketSpacing: true,
          singleQuote: false,
          useTabs: false,
          semi: true,
          plugins: ["prettier-plugin-organize-imports"]
        }
      ],

      "react/react-in-jsx-scope": "off",

      "jsx-a11y/click-events-have-key-events": 0, // @DEBUG, should be re-enabled
      "jsx-a11y/no-noninteractive-element-interactions": 0, // @DEBUG, should be re-enabled
      "jsx-a11y/label-has-associated-control": 0, // @DEBUG
      "jsx-a11y/no-autofocus": 0,
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["invalidHref", "preferButton"]
        }
      ],

      "react/prop-types": 0,
      "react/no-unescaped-entities": 0,
      "@typescript-eslint/no-explicit-any": 0, // @DEBUG
      "@typescript-eslint/no-unused-vars": 0,
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/ban-ts-comment": "off",

      "tailwindcss/no-custom-classname": [
        "off", // @DEBUG
        {
          whitelist: ["list-lower-alpha"],
          callees: ["clsx", "twMerge", "cn"]
        }
      ]
    }
  }
);

export default config;
