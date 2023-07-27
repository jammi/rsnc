const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs').promises;

const {dirExists} = require('lib/util/fileutil');

const isArray = item => {
  return item instanceof Array;
};
const isString = item => {
  return typeof item === 'string';
};
const isObject = item => {
  return typeof item === 'object' && !isArray(item);
};

// Add more items here, when support for them is added:
const handledKeys = [
  'src_dirs', 'theme_names', 'packages', 'gfx_formats',
  'themes_require', 'env'];
const configParsers = (config, filePath) => {
  const handleConfigItemArray = (source, destination, descr) => {
    // handles special items in config arrays:
    const handleArrayDirective = directives => {
      // deletes items from arr:
      const deleteFromArray = itemsToDelete => {
        if (isString(itemsToDelete)) {
          itemsToDelete = [itemsToDelete];
        }
        else if (!isArray(itemsToDelete)) {
          console.warn(`invalid format of items to delete in ${descr}:`, itemsToDelete);
        }
        destination = destination.filter(item => {
          return !(itemsToDelete.includes(item));
        });
      };
      const isPackage = descr.startsWith('packages.');
      const convertFileToPackage = fileName => {
        config.files[fileName] = {
          isFound: false,
          src: ''
        };
        destination.push(fileName);
      };
      Object.entries(directives)
        .forEach(([cmd, props]) => {
          if (cmd === 'delete') {
            deleteFromArray(props);
          }
          else if (isPackage && cmd === 'file') {
            convertFileToPackage(props);
          }
          else {
            console.warn(
              `invalid directive in ${descr}: '${cmd}'; `, props);
          }
        });
      return destination;
    };
    source.forEach(item => {
      if (typeof item === 'string') {
        destination.push(item);
      }
      else if (isObject(item)) {
        destination = handleArrayDirective(item, 'theme_names');
      }
      else {
        console.warn(`invalid item in '${descr}': `, item);
      }
    });
    return destination;
  };
  const configDir = path.dirname(filePath);
  return {
    'src_dirs': srcDirs => {
      srcDirs.forEach(srcDir => {
        const srcPath = path.resolve(configDir, srcDir);
        if (dirExists(srcPath)) {
          config.srcDirs.push(srcPath);
        }
        else {
          console.warn(`invalid item in src_dirs: '${srcPath}'`);
        }
      });
    },
    'theme_names': themeNames => {
      config.themeNames = handleConfigItemArray(
        themeNames, config.themeNames, 'theme_names');
    },
    'packages': packages => {
      Object.entries(packages).forEach(([name, items]) => {
        const destination = config.packages[name] || [];
        config.packages[name] = handleConfigItemArray(
          items, destination, `packages.${name}`);
      });
    },
    'gfx_formats': gfxFormats => {
      config.gfxFormats = handleConfigItemArray(
        gfxFormats, config.gfxFormats, 'gfx_formats');
    },
    'themes_require': themesRequire => {
      Object.entries(themesRequire)
        .forEach(([themeName, requireItems]) => {
          if (!config.themesRequire[themeName]) {
            config.themesRequire[themeName] = {__order: []};
          }
          const themeRequire = config.themesRequire[themeName];
          requireItems.forEach(requireItem => {
            Object.entries(requireItem)
              .forEach(([constName, requirePath]) => {
                if (!themeRequire.__order.includes(constName)) {
                  themeRequire.__order.push(constName);
                  themeRequire[constName] = requirePath;
                }
              });
          });
        });
    },
    'env': envObj => {
      Object.entries(envObj)
        .forEach(([key, value]) => {
          config.env[key] = value;
        });
    }
  };
};

const readConfigFile = configFile => {
  return fs.readFile(configFile)
    .then(yamlSrc => {
      return yaml.load(yamlSrc);
    }, err => {
      console.error('Unable to read config, because:', err);
    })
    .then(config => {
      config._filePath = configFile;
      return config;
    });
};

const readConfig = configFiles => {
  return Promise
    .all(configFiles.map(readConfigFile))
    .then(configs => {
      const parsedConfig = {
        srcDirs: [],
        themeNames: [],
        packages: {},
        gfxFormats: [],
        themesRequire: {},
        env: {},
        files: {}
      };
      configs.forEach(config => {
        const parsers = configParsers(parsedConfig, config._filePath);
        Object.entries(config).forEach(([key, val]) => {
          if (key.startsWith(':')) {
            key = key.slice(1); // older ruby-parsed ones had symbols
          }
          if (handledKeys.includes(key)) {
            parsers[key](val);
          }
        });
      });
      return parsedConfig;
    }
  );
};

module.exports = readConfig;
