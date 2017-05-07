const promisify = require('promisify-node');
const path = require('path');
const fs = promisify('fs');

const pathSetup = require('path_setup');

// recursively reads source paths and file bundles within:
const findInPathConfig = config => {
  // returns function to check if a srcPath is a bundle
  const getIsBundle = srcPath => {
    // returns whether the entry item is a
    // bundle source file, and adds the
    // isJsFile or isCoffeeFile properties to the entry:
    return entry => {
      const pathMatch = ext => {
        return (
          srcPath.split('/').slice(-1)[0] ===
          entry.entryName.split(ext)[0]
        );
      };
      if (entry.isFile) {
        entry.isJsFile = entry.entryName.endsWith('.js');
        entry.isCoffeeFile = entry.entryName.endsWith('.coffee');
        if (entry.isJsFile) {
          return pathMatch('.js');
        }
        else if (entry.isCoffeeFile) {
          return pathMatch('.coffee');
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    };
  };
  const filterHiddenEntries = ({entryName}) => {
    return !entryName.startsWith('.');
  };
  const filterThemeEntries = ({entryName}) => {
    return entryName !== 'themes';
  };
  const expandEntryNameToEntryObject = srcPath => {
    return entryName => {
      const entryPath = path.resolve(srcPath, entryName);
      return fs
        .stat(entryPath)
        .then(fstat => {
          return {
            path: entryPath,
            entryName: entryName,
            isDirectory: fstat.isDirectory(),
            isFile: fstat.isFile(),
            changed: fstat.mtime.getTime()
          };
        });
    };
  };

  const packageBundleNames = (packages => {
    const names = [];
    Object.entries(packages).forEach(([packageName, packageItems]) => {
      packageItems.forEach(name => {
        names.push(name);
      });
    });
    return names;
  })(config.packages);

  const nearestPackageBundleMatch = fullBundlePath => {
    if (packageBundleNames.includes(fullBundlePath)) {
      console.log('is bundle:', fullBundlePath);
      return fullBundlePath;
    }
    let testBundlePath = fullBundlePath;
    while (testBundlePath.length > 0 && testBundlePath.includes('/')) {
      testBundlePath = testBundlePath.slice(
        testBundlePath.indexOf('/') + 1
      );
      if (packageBundleNames.includes(testBundlePath)) {
        console.log('found bundle:', testBundlePath, 'from full:', fullBundlePath);
        return testBundlePath;
      }
    }
    // console.log('no matching bundle for: ', fullBundlePath);
    return null;
  };

  const getBundleName = rootPath => {
    return entry => {
      const fullBundlePath = path.dirname(
        path.relative(rootPath, entry.path)
      );
      return nearestPackageBundleMatch(fullBundlePath);
    };
  };

  const findInPathRoot = source => {
    const rootPath = source.path;
    const bundleName = getBundleName(rootPath);
    const findInPath = srcPath => {
      const isBundle = getIsBundle(srcPath);
      return fs
        .readdir(srcPath)
        .then(entries => {
          return Promise.all(
            entries.map(expandEntryNameToEntryObject(srcPath))
          );
        })
        .then(entries => {
          return Promise.all(
            entries
              .filter(filterHiddenEntries)
              .filter(filterThemeEntries)
              .map(entry => {
                if (entry.isDirectory) {
                  return findInPath(entry.path)
                    .then(children => {
                      entry.children = children;
                      return entry;
                    });
                }
                else if (isBundle(entry)) {
                  entry.bundleName = bundleName(entry);
                  if (entry.bundleName === null) {
                    return null;
                  }
                  else {
                    return fs
                      .readFile(entry.path)
                      .then(src => {
                        entry.isBundle = true;
                        entry.src = src;
                        return entry;
                      });
                  }
                }
                else {
                  return null;
                }
              })
            );
        })
        .then(entries => {
          return Promise.all(
            entries.filter(entry => {
              return entry !== null;
            })
          );
        });
    };
    return findInPath(rootPath);
  };
  return findInPathRoot;
};

const findBundles = config => {
  return Promise.all(
    config
      .srcDirs
      .map(srcDir => {
        return {
          entryName: srcDir,
          isSource: true,
          path: path.resolve(pathSetup.root, srcDir)
        };
      })
      .map(findInPathConfig(config))
  ).then(bundles => {
    return {bundles, config};
  });
};

module.exports = findBundles;
