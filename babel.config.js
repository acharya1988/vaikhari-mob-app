module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Ensure modern RN syntax compiles + keep Worklets plugin last
    plugins: [
      ['@babel/plugin-transform-private-methods', { loose: true }],
      'react-native-worklets/plugin',
    ],
  };
};

