const path = require('path');
const fs = require('fs').promises;

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
