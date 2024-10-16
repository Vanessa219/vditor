import typescriptEslintParser from "@typescript-eslint/parser";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
    ignores: ["**/*.js"],
}, {
    files: ["src/**/*.ts"],
    extends:  [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
    ],
    languageOptions: {
        parser: typescriptEslintParser,
        parserOptions: {
            project: ["./tsconfig.json"],
            createDefaultProgram: true,
        },
    },
},);
