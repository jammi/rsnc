const promisify = require('promisify-node');
const path = require('path');
const fs = promisify('fs');
const pathSetup = require('path_setup');

const findInPathConfig = config => {
  const getIsBundle = srcPath => {
    return entry => {
      return (
        entry.isFile &&
        entry.entryName.slice(-3) === '.js' &&
        srcPath.split('/').slice(-1)[0] === entry.entryName.split('.js')[0]
      );
    };
  };
  const filterHiddenEntries = ({entryName}) => {
    const isHidden = entryName[0] === '.';
    return !isHidden;
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
  const getBundleName = rootPath => {
    return entry => {
      return path.dirname(
        path.relative(rootPath, entry.path)
      );
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
              .map(entry => {
                if (entry.isDirectory) {
                  return findInPath(entry.path)
                    .then(children => {
                      entry.children = children;
                      return entry;
                    });
                }
                else if (isBundle(entry)) {
                  return fs
                    .readFile(entry.path)
                    .then(src => {
                      entry.bundleName = bundleName(entry);
                      entry.isBundle = true;
                      entry.src = src;
                      return entry;
                    });
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
      .src_dirs
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
