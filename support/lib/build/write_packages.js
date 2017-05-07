const promisify = require('promisify-node');
const path = require('path');
const fs = promisify('fs');

const writePackages = outputDir => {
  return ({config, bundles, packages}) => {
    return Promise.all(
      packages.map(({packageName, src}) => {
        const outputPath = path
          .resolve(outputDir, packageName + '.js');
        return fs.writeFile(outputPath, src);
      })
    );
  };
};

module.exports = writePackages;
