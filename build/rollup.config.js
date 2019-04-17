const path = require('path');
const buble = require('rollup-plugin-buble');
const typescript = require('rollup-plugin-typescript');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
};

module.exports = [
  {
    input: resolveFile('src/mreact.ts'),
    output: {
      file: resolveFile('dist/mreact.js'),
      format: 'iife',
      name: 'mreact'
    },
    plugins: [
      typescript(),
      buble(),
    ],
  },
];