const {readFileSync} = require('fs');
const pathSetup = require('path_setup');

const packageTemplate = readFileSync(
  pathSetup.relativeToRoot(
    'support/lib/build/templates/package_template.js'
  )
).toString('utf8');
const bundleTemplate = readFileSync(
  pathSetup.relativeToRoot(
    'support/lib/build/templates/bundle_template.js'
  )
).toString('utf8');

const packageShim = bundles => {
  return packageTemplate
    .replace('$$BUNDLES$$', bundles.join('\n'));
};

const bundleShim = (bundleName, bundle) => {
  return bundleTemplate
    .replace('$$BUNDLE_NAME$$', bundleName)
    .replace('$$BUNDLE$$', bundle.src.toString('utf8'));
};

const makePackages = ({config, bundles}) => {
  const makePackage = ([packageName, packageItems]) => {
    return Promise.resolve().then(() => {
      return {
        packageName: packageName,
        src: packageShim(
          packageItems.map(bundleName => {
            return bundles[bundleName] ?
              bundleName : null;
          }).filter(bundleName => {
            return bundleName !== null;
          }).map(bundleName => {
            return bundleShim(bundleName, bundles[bundleName]);
          })
        )};
    });
  };
  return Promise.all(
    Object
      .entries(config.packages)
      .map(makePackage)
  ).then(packages => {
    return {config, bundles, packages};
  });
};

module.exports = makePackages;
