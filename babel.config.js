module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['lodash'],
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src/'],
        alias: {
          '#assets/*': './src/assets/*',
          '#components/*': './src/components/*',
          '#ui-kit/*': './src/ui-kit/*',
          '#screens/*': './src/screens/*',
          '#modals/*': './src/modals/*',
          '#navigation/*': './src/navigation/*',
          '#api/*': './src/core/api/*',
          '#hooks/*': './src/core/hooks/*',
          '#utils/*': './src/core/utils/*',
          '#services/*': './src/core/services/*',
          '#styles/*': './src/styles/*',
          '#store/*': './src/store/*',
          '#config/*': './src/config/*',

          '#components': './src/components',
          '#ui-kit': './src/ui-kit',
          '#screens': './src/screens',
          '#modals': './src/modals',
          '#navigation': './src/navigation',
          '#api': './src/core/api',
          '#hooks': './src/core/hooks',
          '#utils': './src/core/utils',
          '#services': './src/core/services',
          '#styles': './src/styles',
          '#assets': './src/assets',
          '#store': './src/store',
          '#config': './src/config',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '#env',
        path: './.env',
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
