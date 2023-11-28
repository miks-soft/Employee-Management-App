const error = 'error';
const warn = 'warn';
const off = 'off';

module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['import', 'eslint-plugin-import-helpers', 'unused-imports'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': [error],
        'react-native/no-color-literals': error,
        'react-native/no-single-element-style-arrays': error,
        'react-native/no-inline-styles': 2,
        'react-native/no-unused-styles': 2,
        'import/first': 2,
        'react-native/sort-styles': [
          warn,
          'asc',
          { ignoreClassNames: true, ignoreStyleProperties: false },
        ],
        'react-hooks/exhaustive-deps': off,
        'react/prefer-stateless-function': error,
        'react/jsx-curly-brace-presence': [error, 'never'],
        'react/no-unstable-nested-components': [error, { allowAsProps: true }],
        'no-undef': off,
        'no-shadow': off,
        'no-console': error,
        'no-unused-vars': off,
        'no-restricted-imports': [
          warn,
          {
            paths: ['react-native-reanimated', 'react-native-gesture-handler'],
          },
        ],
        'react/jsx-sort-props': [
          warn,
          {
            callbacksLast: true,
            shorthandFirst: true,
            multiline: 'ignore',
            ignoreCase: true,
            reservedFirst: true,
          },
        ],
        'max-lines': [error, { max: 350, skipBlankLines: true }],
        'arrow-parens': [error, 'as-needed'],
        'import/no-duplicates': error,
        // 'unused-imports/no-unused-imports': error,
        'import-helpers/order-imports': [
          warn,
          {
            newlinesBetween: 'always',
            groups: [
              '/^(react|react-native|react-redux)$/',
              '/#hooks/redux/',
              '/^@/',
              '/^react/',
              'module',
              'absolute',
              '/^#env/',
              '/^#assets/',
              '/^#components/',
              '/^#screens/',
              '/^#navigation/',
              '/^#localization/',
              '/^#api/',
              '/^#services/',
              '/^#config/',
              '/^#hooks/',
              '/^#utils/',
              '/^#styles/',
              '/^#store/',
              '/^#generated/',
              ['parent', 'sibling', 'index'],
            ],
            alphabetize: { order: 'asc', ignoreCase: true },
          },
        ],
      },
    },
  ],
};
