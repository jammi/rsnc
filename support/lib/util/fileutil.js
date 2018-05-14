const {existsSync, statSync} = require('fs');

const dirExists = dirPath => {
  return (
    existsSync(dirPath) &&
    statSync(dirPath).isDirectory()
  );
};

const fileExists = filePath => {
  return (
    existsSync(filePath) &&
    statSync(filePath).isFile()
  );
};

module.exports = {dirExists, fileExists};
