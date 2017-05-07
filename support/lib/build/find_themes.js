const promisify = require('promisify-node');
const path = require('path');
const fs = promisify('fs');

const processEntries = ({config, bundles}) => {
  const findThemePaths = (bundleName, bundle) => {
    const hasTheme = (bundleDir, entries) => {
      const parseThemesDirectory = themesDir => {
        return themeNamesInDir => {
          return config
            .themeNames
            .map(themeName => {
              if (themeNamesInDir.includes(themeName)) {
                return [path.resolve(themesDir, themeName), themeName];
              }
              else {
                return null;
              }
            })
            .filter(themeDir => {
              return themeDir !== null;
            })
            .map(([themeDir, themeName]) => {
              return {themeDir, themeName, bundleName, bundle};
            });
        };
      };
      if (entries.includes('themes')) {
        const themesDir = path.resolve(bundleDir, 'themes');
        return fs
          .readdir(themesDir)
          .then(parseThemesDirectory(themesDir));
      }
      else {
        return false;
      }
    };
    const bundleDir = path.dirname(bundle.path);
    return fs
      .readdir(bundleDir)
      .then(entries => {
        return hasTheme(bundleDir, entries);
      });
  };
  return Promise
    .all(
      Object
        .entries(bundles)
        .map(([bundleName, bundle]) => {
          return findThemePaths(bundleName, bundle);
        })
    )
    .then(themePaths => {
      return {config, bundles, themePaths: themePaths
        .filter(themePath => {
          return themePath !== false;
        })
      };
    });
};

module.exports = processEntries;
