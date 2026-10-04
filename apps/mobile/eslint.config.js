// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

const COLOR_LITERAL = '/^(#([0-9a-fA-F]{3,8})|rgba?\\(|hsla?\\()/';

module.exports = defineConfig([
  expoConfig,
  globalIgnores(['dist/*', 'web-build/*', '.expo/*', 'expo-env.d.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    // SPEC rule 5: screens and components use design tokens only.
    // Colors must come from @leafy/ui-tokens via useTheme().
    files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=${COLOR_LITERAL}]`,
          message: 'Hardcoded color. Use a token from useTheme().colors (packages/ui-tokens).',
        },
        {
          selector: `TemplateElement[value.raw=${COLOR_LITERAL}]`,
          message: 'Hardcoded color. Use a token from useTheme().colors (packages/ui-tokens).',
        },
      ],
    },
  },
]);
