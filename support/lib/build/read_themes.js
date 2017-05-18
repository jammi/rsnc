const promisify = require('promisify-node');
const path = require('path');
const fs = promisify('fs');

const processEntries = ({themePaths, config, bundles}) => {
  const gfxFormats = config.gfxFormats;
  const themeBundleNames = [];
  const readThemeData = (
    {bundleName, bundle, themeName, themeObj, themeDir}
  ) => {
    const themeBaseName = bundleName.includes('/') ?
      path.basename(bundleName) : bundleName;
    const themeExpectedHtmlName = `${themeBaseName}.html`;
    const themeExpectedCssName = `${themeBaseName}.css`;
    return themeFiles => {
      const hasHtml = themeFiles.includes(themeExpectedHtmlName);
      const hasCss = themeFiles.includes(themeExpectedCssName);
      if (hasHtml || hasCss) {
        const operations = [];
        themeBundleNames.push(bundleName);
        if (hasHtml) {
          const themeHtmlPath = path.resolve(
            themeDir, themeExpectedHtmlName);
          operations.push(
            fs.readFile(themeHtmlPath)
              .then(src => {
                src = src.toString('utf8');
                themeObj.html = {
                  src, path: themeHtmlPath
                };
                return true;
              })
            );
        }
        else {
          themeObj.html = {
            src: '', path: null
          };
        }
        if (hasCss) {
          const themeCssPath = path.resolve(
            themeDir, themeExpectedCssName);
          operations.push(
            fs.readFile(themeCssPath)
              .then(src => {
                src = src.toString('utf8');
                themeObj.css = {
                  src, path: themeCssPath
                };
                return true;
              })
          );
        }
        else {
          themeObj.css = {
            src: '', path: null
          };
        }
        const gfxFileNames = themeFiles
          .filter(fileName => {
            return gfxFormats.includes(
              path.extname(fileName));
          })
          .map(fileName => {
            return [fileName, path.resolve(
              themeDir, fileName)];
          });
        operations.concat(
          gfxFileNames
            .map(([fileName, themeFilePath]) => {
              return fs
                .readFile(themeFilePath)
                .then(fileData => {
                  themeObj.gfx[fileName] = {
                    fileData, path: themeFilePath
                  };
                });
            })
        );
        return Promise.all(operations);
      }
      else {
        return null;
      }
    };
  };
  const setupThemeData = themeDirs => {
    return Promise.all(
      themeDirs.map(({
        themeDir, themeName, bundleName, bundle
      }) => {
        bundle.hasThemes = true;
        if (!bundle.themes) {
          bundle.themes = {};
        }
        const themeObj = {
          componentName: path.basename(path.dirname(bundle.path)),
          path: themeDir,
          css: null,
          html: null,
          gfx: {}
        };
        bundle.themes[themeName] = themeObj;
        return fs
          .readdir(themeDir)
          .then(readThemeData({
            bundleName, bundle, themeName, themeObj, themeDir}));
      })
    );
  };
  return Promise.all(
    themePaths.map(setupThemeData)
  ).then(() => {
    return {config, bundles, themeBundleNames};
  });
};

module.exports = processEntries;
