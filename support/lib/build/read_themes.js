const promisify = require('promisify-node');
const path = require('path');
const fs = promisify('fs');

const processEntries = ({themePaths, config, bundles}) => {
  const readThemeData = themeDirs => {
    return Promise.all(
      themeDirs.map(({
        themeDir, themeName, bundleName, bundle
      }) => {
        bundle.hasThemes = true;
        if (!bundle.themes) {
          bundle.themes = {};
        }
        const themeObj = {
          path: themeDir,
          css: null,
          html: null,
          gfx: []
        };
        bundle.themes[themeName] = themeObj;
        return fs
          .readdir(themeDir)
          .then(themeFiles => {
            Promise.all(
              themeFiles
                .map(themeFile => {
                  const themeFilePath = path.resolve(themeDir, themeFile);
                  console.log(themeFilePath);
                })
            );
          });
      })
    );
  };
  return Promise.all(
    themePaths.map(readThemeData)
  ).then(() => {
    return {config, bundles};
  });
};

module.exports = processEntries;
