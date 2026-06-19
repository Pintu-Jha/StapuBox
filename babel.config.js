module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    // react-native-reanimated/plugin MUST be the last plugin
    'react-native-reanimated/plugin',
  ],
};
