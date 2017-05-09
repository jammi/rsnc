const {readFileSync} = require('fs');
const pathSetup = require('path_setup');

const shims = (config, options) => {
  const packageTemplate = readFileSync(
    options.packageTemplate ?
      options.packageTemplate :
      pathSetup.relativeToRoot(
        'support/lib/build/templates/package_template.js'
    )
  ).toString('utf8');
  const bundleTemplate = readFileSync(
    options.bundleTemplate ?
      options.bundleTemplate :
      pathSetup.relativeToRoot(
        'support/lib/build/templates/bundle_template.js'
      )
  ).toString('utf8');

  const packageShim = bundles => {
    return packageTemplate
      .replace('$$PROCESS_ENV$$', JSON.stringify(config.env))
      .replace('$$BUNDLES$$', bundles.join('\n'));
  };

  const bundleShim = (bundleName, bundle) => {
    return bundleTemplate
      .replace('$$BUNDLE_NAME$$', bundleName)
      .replace('$$BUNDLE$$', bundle.src.toString('utf8'));
  };
  return {packageShim, bundleShim};
};

const makePackages = ({config, bundles}) => {
  const makePackage = ([packageName, packageItems]) => {
    const packageConfig = packageName === 'core' ?
      {packageTemplate: pathSetup.relativeToRoot(
        'support/lib/build/templates/main_package_template.js'
      )} : {};
    const {bundleShim, packageShim} = shims(config, packageConfig);
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
