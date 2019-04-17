process.env.NODE_ENV = 'development';

const path = require('path');
const serve = require('rollup-plugin-serve');
const configList = require('./rollup.config');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
};
const PORT = 5000;

configList.map((config, index) => {

  // Still don't know how to send the source map to fe beside setting it inline
  config.output.sourcemap = 'inline';

  if( index === 0 ) {
    config.plugins = [
      ...config.plugins,
      ...[
        serve({
          port: PORT,
          contentBase: [resolveFile('')]
        })
      ]
    ]
  }

  return config;
});

module.exports = configList;