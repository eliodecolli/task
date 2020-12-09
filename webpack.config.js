const path = require('path');

module.exports = {
  mode: 'development',
  entry: [
      './typescript/index.ts'
    ],
  output: {
    filename: 'task_components.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
        extensions: ['.ts', '.js'],
  },
  module: {
      rules: [
          {
              test: /\.tsx?/,
              use: 'ts-loader',
              exclude: '/node_modules/'
          }
      ]
  },
  devtool: 'source-map',
  watch: true
};