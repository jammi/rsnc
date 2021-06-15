const path = require('path');
const fs = require('fs').promises;

const processEntries = ({config, bundles}) => {
  // shortcut for themes; rather than 'themes/themename/',
  // allows allows 'themename_theme/' in a flatter structure
  // for instance with the 'default' theme, it's
  // 'default_theme/' with the css & html templates and
  // graphic files rather than in 'themes/default/'
  const flatThemeNames = config.themeNames.map(themeName => {
    return `${themeName}_theme`;
  });
  const findThemePaths = (bundleName, bundle) => {
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
    const findFlattenedThemes = entries => {
      return entries.filter(entry => {
        return flatThemeNames.includes(entry);
      });
    };
    const hasTheme = (bundleDir, entries) => {
      if (entries.includes('themes')) {
        const themesDir = path.resolve(bundleDir, 'themes');
        return fs
          .readdir(themesDir)
          .then(parseThemesDirectory(themesDir));
      }
      else {
        const foundFlatThemes = findFlattenedThemes(entries);
        if (foundFlatThemes.length > 0) {
          return Promise.resolve(
            foundFlatThemes.map(flatThemeName => {
              return {
                themeDir: path.resolve(bundleDir, flatThemeName),
                themeName: flatThemeName.split('_theme')[0],
                bundleName, bundle
              };
            })
          );
        }
        else {
          return false;
        }
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
      return {
        config, bundles,
        themePaths: themePaths.filter(themePath => {
          return themePath !== false;
        })
      };
    });
};

module.exports = processEntries;
