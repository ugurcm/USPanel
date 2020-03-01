const path = require('path');

module.exports = {
  mode: 'production',
  entry: './assets/js/site.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'assets/bundle'),
  },
};
