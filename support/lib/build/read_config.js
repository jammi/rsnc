const promisify = require('promisify-node');
const yaml = require('js-yaml');
const fs = promisify('fs');

const readConfig = configFile => {
  console.log('reading build config file:', configFile);
  return fs.readFile(configFile)
    .then(yamlSrc => {
      return yaml.load(yamlSrc);
    }, err => {
      console.error('Unable to read config, because:', err);
    });
};

module.exports = readConfig;
